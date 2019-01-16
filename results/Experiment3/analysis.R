# PREAMBLE

library(tidyverse)
library(ordinal)
library(bootstrap)
library(rwebppl)
library(jsonlite)
library(lme4)
library(lsmeans)

setwd("~/Documents/GitHub/alts/results/Experiment3")

# HELPER SCRIPTS

theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}

ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

# LOAD DATA

d <- read.csv("results.csv")

# RUN EXCLUSIONS

# EXCLUDE NON-NATIVE ENGLISH SPEAKERS

levels(d$language) # KEEP DATA IF LANGUAGE = SOME SPELLING VARIATION OF 'ENGLISH' (OR NA)

d <- d %>%
  filter(!(language == "Russian"))

# EXCLUDE PEOPLE WHO FAIL MORE THAN ONE EXCLUSION TRIAL

to_exclude <- d %>%
  group_by(workerid, type, selection) %>%
  filter((type == "left" && selection == "right") || (type == "right" && selection  == "left")) %>%
  group_by(workerid) %>%
  summarize(n_mistakes = n()) %>%
  filter(n_mistakes > 0)

d <- d %>%
  filter(!(workerid %in% to_exclude$workerid))

# PROPORTION OF COMPETITOR PICTURES CHOSEN

sel_counts <- d %>%
  # ONLY INTERESTED IN "LOOKS LIKE" TRIALS...
  filter(type == "looks like") %>%
  # ... THAT THE CONDITIONS SHARE IN COMMON
  filter(id %in% (d %>% filter(type == "looks like" & condition == "symmetric"))$id) %>%
  group_by(workerid,condition) %>%
  summarize(n = n(), ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            pcompetitor = ncompetitor / (ncompetitor + ntarget)) 

sel_counts_learning <- d %>%
  # ONLY INTERESTED IN "LOOKS LIKE" TRIALS...
  filter(type == "looks like") %>%
  # ... THAT THE CONDITIONS SHARE IN COMMON
  filter(id %in% (d %>% filter(type == "looks like" & condition == "symmetric"))$id) %>%
  mutate(half = ifelse(order < 13, 1, 2)) %>%
  group_by(workerid,condition,half) %>%
  summarize(n = n(), ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            pcompetitor = ncompetitor / (ncompetitor + ntarget)) 

# LOGISTIC REGRESSION TO INVESTIGATE EFFECT OF CONDITION (MAX RANEF STRUCTURE)

d$selection <- relevel(d$selection, ref = "target")
d$condition <- relevel(d$condition, ref = "control")

d_filtered <- d %>%
  # ONLY INTERESTED IN "LOOKS LIKE" TRIALS...
  filter(type == "looks like") %>%
  # ... THAT THE CONDITIONS SHARE IN COMMON
  filter(id %in% (d %>% filter(type == "looks like" & condition == "symmetric"))$id)

# EXAMPLE: BINARY LOGISTIC REGRESSION BETWEEN CONTROL AND TARGET CONDITIONS

m <- glmer(selection ~ condition + (1|workerid) + (1 + condition|id), family = "binomial", data = d_filtered)

lsmeans(m, revpairwise~condition)

# EXPLORATORY ANALYSIS: LOOKING FOR ORDER EFFECTS

m2 <- glmer(selection ~ condition + order + (1 + order|workerid) + (1 + order + condition|id), family = "binomial", data = d_filtered)

summary(m2)

# BAYESIAN DATA ANALYSIS

# LOAD & TRANSFORM DATA FROM NORMING STUDIES 

d_noprompt <- read.csv("results_noprompt.csv")

levels(d_noprompt$language) # KEEP DATA IF LANGUAGE = SOME SPELLING VARIATION OF 'ENGLISH' (OR NA)

noprompt_to_exclude <- d %>%
  group_by(workerid, type, selection) %>%
  filter((type == "left" && selection == "right") || (type == "right" && selection  == "left")) %>%
  group_by(workerid) %>%
  summarize(n_mistakes = n()) %>%
  filter(n_mistakes > 0)

d_noprompt <- d_noprompt %>%
  filter(!(workerid %in% noprompt_to_exclude$workerid))

d_noprompt <- d_noprompt %>%
  filter(kind == "critical") %>%
  group_by(id) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            competitor_prior = ncompetitor / (ncompetitor + ntarget))

d_naming <- read.csv("results_naming.csv")

d_naming <- d_naming %>%
  group_by(id) %>%
  summarize(nknowtarget = sum(type == "target" & know == "True"),
            nknowcompetitor = sum(type == "competitor" & know == "True"),
            target_nameability = nknowtarget / sum(type == "target"),
            competitor_nameability = nknowcompetitor / sum(type == "competitor"))

# INFER PARAMS GLOBALLY

bda <- read_file("bda_inferglobalparams.txt")

d_total <- d %>%
  filter(kind == "critical" & type == "looks like") %>% 
  group_by(id,condition) %>%summarize(ntarget = sum(selection == "target"), 
                  ncompetitor = sum(selection == "competitor"), 
                  observed_competitor = ncompetitor / (ncompetitor + ntarget))

d_total <- merge(d_total, d_naming, by = "id")
d_total <- merge(d_total, d_noprompt, by = "id")
d_total <- d_total %>%
  select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)

d_total_JSON <- toJSON(d_total)

full_bda <- webppl(paste("var itemData = ", d_total_JSON, "\n", bda))

full_posteriors <- (full_bda$posteriors)$support

full_maxap <- (full_bda$maxap)

write.csv(full_posteriors, file = "posteriors/posteriors_fulldata.csv")

# INFER PARAMS BY CONDITION

bda_bycondition <- read_file("bda_bycondition.txt")

# GET BY-ITEM DATA BY CONDITION

data_byitem <- function(cond, data) {
  output <- data %>%
    filter(condition == cond & kind == "critical" & type == "looks like") %>% 
    group_by(id) %>%
    summarize(ntarget = sum(selection == "target"), 
              ncompetitor = sum(selection == "competitor"), 
              observed_competitor = ncompetitor / (ncompetitor + ntarget))
  output <- merge(output, d_naming, by = "id")
  output <- merge(output, d_noprompt, by = "id")
  output <- output %>%
    select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)
}

symmetric_byitem <-data_byitem("symmetric",d)
control_byitem <-data_byitem("control",d)
target_byitem <-data_byitem("target",d)
nottarget_byitem <-data_byitem("nottarget",d)

# INFER PARAMETERS: CONTROL CONDITION

control_byitem_json <- toJSON(control_byitem)

control_bda <- webppl(paste("var itemData = ", control_byitem_json, 
                                        "\n var alpha =", full_maxap$alpha,
                                        "\n", bda_bycondition))

posteriors_control <- (control_bda$posteriors)$support

write.csv(posteriors_control, file = "posteriors/posteriors_control.csv")

# INFER PARAMETERS: TARGET CONDITION

target_byitem_json <- toJSON(target_byitem)

target_bda <- webppl(paste("var itemData = ", target_byitem_json, 
                                        "\n var alpha =", full_maxap$alpha,
                                        "\n", bda_bycondition))

posteriors_target <- (target_bda$posteriors)$support

write.csv(posteriors_target, file = "posteriors/posteriors_target.csv")

# INFER PARAMETERS: NOT-TARGET CONDITION

nottarget_byitem_json <- toJSON(nottarget_byitem)

nottarget_bda <- webppl(paste("var itemData = ", nottarget_byitem_json, 
                                      "\n var alpha =", full_maxap$alpha,
                                      "\n", bda_bycondition))

posteriors_nottarget <- (nottarget_bda$posteriors)$support

write.csv(posteriors_nottarget, file = "posteriors/posteriors_nottarget.csv")

# INFER PARAMETERS: SYMMETRIC CONDITION

symmetric_byitem_json <- toJSON(symmetric_byitem)

symmetric_bda <- webppl(paste("var itemData = ", symmetric_byitem_json, 
                                        "\n var alpha =", full_maxap$alpha,
                                        "\n", bda_bycondition))

posteriors_symmetric <- (symmetric_bda$posteriors)$support

write.csv(posteriors_symmetric, file = "posteriors/posteriors_symmetric.csv")

# NEW VISUALIZATIONS

full_posteriors <- read.csv("posteriors/posteriors_fulldataset.csv")
posteriors_control <- read.csv("posteriors/posteriors_control.csv")
posteriors_target <- read.csv("posteriors/posteriors_target.csv")
posteriors_nottarget <- read.csv("posteriors/posteriors_nottarget.csv")
posteriors_symmetric <- read.csv("posteriors/posteriors_symmetric.csv")

# BY-CONDITION VISUALIZATIONS

dodge = position_dodge(.9)

toplot <- function (data) {
  output <- data %>% 
    # group_by(condition,half) %>%
    group_by(condition) %>%
    summarize(Mean = mean(pcompetitor),CILow=ci.low(pcompetitor),CIHigh =ci.high(pcompetitor)) %>%
    ungroup() %>%
    mutate(Ymin=Mean-CILow,Ymax=Mean+CIHigh)
  return(output)
}

plot_means <- function (toplot) {
  ggplot(toplot, aes(x=condition,y=Mean)) +
    # facet_wrap(~half) +
    geom_bar(stat="identity",position = "dodge") +
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25, position = dodge) + 
    labs(x = "Condition", y = "Proportion")  # +
  # ggtitle("Proportion of a competitor image chosen on 'looks like' trials\n(Experiment 3)")
}

plot_means(toplot(sel_counts))

# BY-ITEM VISUALIZATIONS 

byitem <- d %>%
  filter(kind == "critical" & type == "looks like") %>% 
  # ... THAT THE CONDITIONS SHARE IN COMMON
  filter(id %in% (d %>% filter(type == "looks like" & condition == "symmetric"))$id) %>%
  group_by(id,condition) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            observed_competitor = ncompetitor / (ncompetitor + ntarget))

byitem <- merge(byitem, d_naming, by = "id")
byitem <- merge(byitem, d_noprompt, by = "id")
byitem <- byitem %>%
  mutate(nameability_index = target_nameability / competitor_nameability)

table(d$id, d$condition, d$type)

ggplot(byitem, aes(x=condition, y=observed_competitor)) +
  facet_wrap(~id)+
  geom_point() + 
  labs(x = "Condition", y = "Proportion") +
  # ggtitle("Proportion of a competitor image chosen on 'looks like' trials\n(By item, Experiment 3)") +
  theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1))

# ALPHA PARAMETER GLOBAL DIST

ggplot(full_posteriors, aes(alpha)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred alpha parameter value", y = "Density") # +
# ggtitle("Posterior distribution of alpha parameter values\n(Experiment 3)") 

# VISUALIZE POSTERIOR PARAMS BY CONDITION 

vizparams_bycondition <- function(posteriors) {
  toplot <- posteriors %>% 
    select(cost_is,cost_lookslike,cost_not) %>%
    gather(key = "parameter", value = "cost")
  ggplot(toplot, aes(cost, fill = parameter)) + geom_density(alpha = 0.2) +
    labs(x = "Inferred value", y = "Density")
}

vizparams_bycondition(posteriors_control)
vizparams_bycondition(posteriors_target)
vizparams_bycondition(posteriors_nottarget)
vizparams_bycondition(posteriors_symmetric)

# VISUALIZE POSTERIOR PREDICTIVES BY CONDITION 

View(symmetric_bda$predictions)

predictive_plot <- function(bda, data) {
  predictions <- bda$predictions
  observations <- data$observed_competitor
  toplot <- cbind(predictions, observations)
  colnames(toplot) <- c("id","prediction","observation")
  ggplot(toplot, aes(x=prediction, y=observation)) + geom_point() 
}

predictive_plot(symmetric_bda, symmetric_byitem)
predictive_plot(target_bda, target_byitem)
predictive_plot(nottarget_bda, nottarget_byitem)
predictive_plot(control_bda, control_byitem)

# EXPLORATORY ANALYSIS: CATEGORICAL COST 

# INFER PARAMETERS: CONTROL CONDITION

bda_categcost <- read_file("bda_bycondition_categcost.txt")

control_bda_categcost <- webppl(paste("var itemData = ", control_byitem_json, 
                            "\n var alpha =", full_maxap$alpha,
                            "\n", bda_categcost))

posteriors_control_categcost <- cbind((control_bda_categcost$posteriors)$support, (control_bda_categcost$posteriors)$probs)

write.csv(posteriors_control_categcost, file = "posteriors/posteriors_control_categcost.csv")

# INFER PARAMETERS: TARGET CONDITION

target_bda_categcost <- webppl(paste("var itemData = ", target_byitem_json, 
                           "\n var alpha =", full_maxap$alpha,
                           "\n", bda_categcost))

posteriors_target_categcost <- cbind((target_bda_categcost$posteriors)$support, (target_bda_categcost$posteriors)$probs)

write.csv(posteriors_target_categcost, file = "posteriors/posteriors_target_categcost.csv")

# INFER PARAMETERS: NOT-TARGET CONDITION

nottarget_bda_categcost <- webppl(paste("var itemData = ", nottarget_byitem_json, 
                              "\n var alpha =", full_maxap$alpha,
                              "\n", bda_categcost))

posteriors_nottarget_categcost <- cbind((nottarget_bda_categcost$posteriors)$support, (nottarget_bda_categcost$posteriors)$probs)

write.csv(posteriors_nottarget_categcost, file = "posteriors/posteriors_nottarget_categcost.csv")

# INFER PARAMETERS: SYMMETRIC CONDITION

symmetric_bda_categcost <- webppl(paste("var itemData = ", symmetric_byitem_json, 
                              "\n var alpha =", full_maxap$alpha,
                              "\n", bda_categcost))

posteriors_symmetric_categcost <- cbind((symmetric_bda_categcost$posteriors)$support, (symmetric_bda_categcost$posteriors)$probs)

write.csv(posteriors_symmetric_categcost, file = "posteriors/posteriors_symmetric_categcost.csv")

vizparams_bycondition_categcost <- function(posteriors) {
  toplot <- posteriors %>% 
    select(cost_is,cost_lookslike,cost_not) %>%
    gather(key = "parameter", value = "cost")
  ggplot(toplot, aes(cost, fill = parameter)) + geom_bar() +
    labs(x = "Inferred value", y = "Density")
}

vizparams_bycondition_categcost(posteriors_control_categcost)
vizparams_bycondition(posteriors_target_categcost)
vizparams_bycondition(posteriors_nottarget_categcost)
vizparams_bycondition(posteriors_symmetric_categcost)
