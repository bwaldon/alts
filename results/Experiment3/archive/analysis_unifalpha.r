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


# VISUALIZE RESULTS BY CONDITION

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

# MERGE TO MAIN STUDY DATA FROM SYMMETRIC CONDITION

symmetric_byitem <- d %>%
  filter(condition == "symmetric" & kind == "critical" & type == "looks like") %>% 
  group_by(id) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            observed_competitor = ncompetitor / (ncompetitor + ntarget))

symmetric_byitem <- merge(symmetric_byitem, d_naming, by = "id")
symmetric_byitem <- merge(symmetric_byitem, d_noprompt, by = "id")
symmetric_byitem <- symmetric_byitem %>%
  select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)

# VISUALIZATIONS 

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

# NEW ANALYSIS - DON'T INFER ALPHA

# bda <- read_file("bda_unifalpha.txt")
bda <- read_file("bda_unifalpha_3utt.txt")

# INFER PARAMETERS: CONTROL CONDITION

control_byitem <- d %>%
  filter(condition == "control" & kind == "critical" & type == "looks like") %>% 
  group_by(id) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            observed_competitor = ncompetitor / (ncompetitor + ntarget))

control_byitem <- merge(control_byitem, d_naming, by = "id")
control_byitem <- merge(control_byitem, d_noprompt, by = "id")
control_byitem <- control_byitem %>%
  select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)

control_byitem_json <- toJSON(control_byitem)

control_bda <- webppl(paste("var itemData = ", control_byitem_json,
                            "\n", bda))

posteriors_control_unifalpha <- (control_bda$posteriors)$support

# write.csv(posteriors_control_unifalpha, file = "posteriors_control_unifalpha.csv")
write.csv(posteriors_control_unifalpha, file = "posteriors_control_unifalpha_3utt.csv")

# INFER PARAMETERS: TARGET CONDITION [everything below here needs to change]

target_byitem <- d %>%
  filter(condition == "target" & kind == "critical" & type == "looks like") %>% 
  group_by(id) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            observed_competitor = ncompetitor / (ncompetitor + ntarget))

target_byitem <- merge(target_byitem, d_naming, by = "id")
target_byitem <- merge(target_byitem, d_noprompt, by = "id")
target_byitem <- target_byitem %>%
  select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)

target_byitem_json <- toJSON(target_byitem)

target_bda <- webppl(paste("var itemData = ", target_byitem_json, 
                           "\n", bda))

posteriors_target_unifalpha <- (target_bda$posteriors)$support

# write.csv(posteriors_target_unifalpha, file = "posteriors_target_unifalpha.csv")
write.csv(posteriors_target_unifalpha, file = "posteriors_target_unifalpha_3utt.csv")

# INFER PARAMETERS: NOT-TARGET CONDITION

nottarget_byitem <- d %>%
  filter(condition == "nottarget" & kind == "critical" & type == "looks like") %>% 
  group_by(id) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            observed_competitor = ncompetitor / (ncompetitor + ntarget))

nottarget_byitem <- merge(nottarget_byitem, d_naming, by = "id")
nottarget_byitem <- merge(nottarget_byitem, d_noprompt, by = "id")
nottarget_byitem <- nottarget_byitem %>%
  select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)

nottarget_byitem_json <- toJSON(nottarget_byitem)

nottarget_bda <- webppl(paste("var itemData = ", nottarget_byitem_json, 
                              "\n", bda))

posteriors_nottarget_unifalpha <- (nottarget_bda$posteriors)$support

# write.csv(posteriors_nottarget_unifalpha, file = "posteriors_nottarget_unifalpha.csv")
write.csv(posteriors_nottarget_unifalpha, file = "posteriors_nottarget_unifalpha_3utt.csv")

# INFER PARAMETERS: SYMMETRIC CONDITION

symmetric_byitem <- d %>%
  filter(condition == "symmetric" & kind == "critical" & type == "looks like") %>% 
  group_by(id) %>%
  summarize(ntarget = sum(selection == "target"), 
            ncompetitor = sum(selection == "competitor"), 
            observed_competitor = ncompetitor / (ncompetitor + ntarget))

symmetric_byitem <- merge(symmetric_byitem, d_naming, by = "id")
symmetric_byitem <- merge(symmetric_byitem, d_noprompt, by = "id")
symmetric_byitem <- symmetric_byitem %>%
  select(id,observed_competitor,competitor_prior,target_nameability,competitor_nameability)

symmetric_byitem_json <- toJSON(symmetric_byitem)

symmetric_bda <- webppl(paste("var itemData = ", symmetric_byitem_json, 
                              "\n", bda))

posteriors_symmetric_unifalpha <- (symmetric_bda$posteriors)$support

#write.csv(posteriors_symmetric_unifalpha, file = "posteriors_symmetric_unifalpha.csv")
write.csv(posteriors_symmetric_unifalpha, file = "posteriors_symmetric_unifalpha_3utt.csv")

# NEW VISUALIZATIONS

# Visualize params of control condition 

graph_control <- posteriors_control_unifalpha %>%
  #select(cost_istarget,cost_looksliketarget,cost_nottarget) %>%
  select(cost_is,cost_lookslike,cost_not) %>%
  gather(key = "parameter", value = "cost")

ggplot(graph_control, aes(cost, fill = parameter)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred value", y = "Density") # +
# ggtitle("Posterior distribution of cost values for 'It looks like a [target]'\n(Experiment 3)") 

# Visualize params of target condition 

graph_target <- posteriors_target_unifalpha %>%
  # select(cost_istarget,cost_looksliketarget,cost_nottarget) %>%
  select(cost_is,cost_lookslike,cost_not) %>%
  gather(key = "parameter", value = "cost")

ggplot(graph_target, aes(cost, fill = parameter)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred value", y = "Density") # +
# ggtitle("Posterior distribution of cost values for 'It looks like a [target]'\n(Experiment 3)") 

# Visualize params of not-target condition 

graph_nottarget <- posteriors_nottarget_unifalpha %>%
  # select(cost_istarget,cost_looksliketarget,cost_nottarget) %>%
  select(cost_is,cost_lookslike,cost_not) %>%
  gather(key = "parameter", value = "cost")

ggplot(graph_nottarget, aes(cost, fill = parameter)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred value", y = "Density") # +
# ggtitle("Posterior distribution of cost values for 'It looks like a [target]'\n(Experiment 3)")

# Visualize params of symmetric condition 

graph_symmetric <- posteriors_symmetric_unifalpha %>%
 # select(cost_istarget,cost_looksliketarget,cost_nottarget) %>%
  select(cost_is,cost_lookslike,cost_not) %>%
  gather(key = "parameter", value = "cost")

ggplot(graph_symmetric, aes(cost, fill = parameter)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred value", y = "Density") # +
# ggtitle("Posterior distribution of cost values for 'It looks like a [target]'\n(Experiment 3)")

# POSTERIOR PREDICTIVE CHECKS


