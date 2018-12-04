library(tidyverse)
library(bootstrap)
library(formatR)
library(reshape)
library(lme4)
library(lmerTest)

# HELPERS

theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}

ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

# EXPERIMENT 2

setwd("~/Documents/GitHub/ad_qp")

d <- read.csv("results/6scale_full/results.csv",header = TRUE, stringsAsFactors = FALSE)

d[d$target == "tasty",]$target <- "palatable"

d <- data.frame(lapply(d, function(x) {
  gsub('"', '', x)
}))

d <- data.frame(lapply(d, function(x) {
  gsub('\\\\', '', x)
}))

exp2 <- d %>%
  filter(Answer.list %in% c("list1_exh", "list2_exh"))

# Native language exclusion criteria

length(unique(exp2$workerid)) #should be 107

unique(exp2$language) # two people in exp2 need to be excluded by virtue of native lang. 

lang_excl <- exp2 %>% 
  filter(language %in% c("Italian","Urdu")) %>%
  group_by(language) %>%
  summarize(n = n()/32)

exp2 <- exp2 %>%
  filter(!(language %in% c("Italian","Urdu")))

# Control trial exclusion criteria

exp2$correct <- 0
exp2[exp2$id %in% c("high_right1","high_right2","high_right3"),]$correct <- "high"
exp2[exp2$id %in% c("low_right1","low_right2","low_right3"),]$correct <- "low"

exp2$response <- as.numeric(exp2$response)

# 3 people need to be excluded by virtue of failing one or more control trials

d_excl_exp2 <- exp2 %>%
  group_by(workerid, id, correct) %>%
  summarize(response) %>%
  filter((correct == "high" && response < 50) || (correct == "low" && response > 50)) %>%
  group_by(workerid) %>%
  summarize(n_mistakes = n()) %>%
  filter(n_mistakes > 1)

exp2 <- exp2 %>%
  filter(!(workerid %in% d_excl_exp2$workerid)) %>%
  filter(type %in% c("prime","crit"))

length(unique(exp2$workerid)) # should now be 102

# NASTY DATA TRANSFORMING...

fillTheBlanks <- function(x, missing="na"){
  rle <- rle(as.character(x))
  empty <- which(rle$value==missing)
  rle$values[empty] <- rle$value[empty-1] 
  inverse.rle(rle)
}

exp2$primetype <- fillTheBlanks(exp2$primetype)

# BY CONDITION MEANS, EXP2

dodge = position_dodge(.9)

toplot <- function (data) {
  output <- data %>% 
    filter(type == "crit") %>%
    group_by(target, primetype) %>%
    summarize(Mean = mean(response),CILow=ci.low(response),CIHigh =ci.high(response),n=n()) %>%
    ungroup() %>%
    mutate(Ymin=Mean-CILow,Ymax=Mean+CIHigh)
  return(output)
}

plot_means <- function (toplot) {
  ggplot(toplot, aes(x=primetype,y=Mean)) +
    facet_wrap(~target) +
    geom_bar(stat="identity",position = "dodge") +
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25, position = dodge) + 
    labs(x = "Condition", y = "Interpretation\n(100 = maximum exhaustivity inference)") +
    ggtitle("Strength of exhaustivity interpretations by priming condition\n(Experiment 2)") +
    scale_x_discrete(labels=c("No-prime", "Prime"))
}

plot_means(toplot(exp2))

# LINEAR REGRESSION ANALYSIS

exp2$primetype <- relevel(factor(exp2$primetype), ref = "no")

m_exp2 <- lmer(response ~ primetype * target + (primetype|workerid), data = exp2 %>% filter(type == "crit"))

summary(m_exp2)

# VISUALIZATIONS 

# BY-SUBJECT VARIABILITY 

toplot_subjectvar <- function(data){
  output = data %>%
    filter((type == "crit" | type == "prime")) %>%
    group_by(primetype,type,target) %>%
    summarize(Mean = mean(response),CILow=ci.low(response),CIHigh =ci.high(response),n=n()) %>%
    ungroup() %>%
    mutate(Ymin=Mean-CILow,Ymax=Mean+CIHigh)
  output$type <- relevel(output$type, ref = "prime")
  return(output)
} 

toplot_subjectvar_bysubject <- function(data) {
  output = data %>%
    filter((type %in% c("crit","prime"))) %>%
    group_by(primetype,type,target,workerid) %>%
    summarize(Mean = mean(response),CILow=ci.low(response),CIHigh =ci.high(response)) %>%
    ungroup() %>%
    mutate(Ymin=Mean-CILow,Ymax=Mean+CIHigh)
  output$type <- relevel(output$type, ref = "prime")
  return(output)
}

plot_subjectvar <- function(subjectvar, subjectvar_bysubject) {
  ggplot(subjectvar, aes(x=type,y=Mean)) +
    geom_bar(stat="identity") +
    facet_grid(primetype ~ target, labeller = labeller(
      primetype = c('no' = "No-prime condition", 'exh' = "Prime Condition")
    )) +
    geom_line(data = subjectvar_bysubject, aes(group=workerid), color = "red", alpha = 0.5) + 
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25) +  
    geom_point(data = subjectvar_bysubject) +
    ggtitle("By-subject change in behavior between priming and critical trials\n(Experiment 2)") +
    labs(x = "Trial type", y = "Interpretation\n(100 = maximum exhaustivity inference)") +
    scale_x_discrete(labels=c("Priming trials", "Critical trial"))
}

plot_subjectvar(toplot_subjectvar(exp2),toplot_subjectvar_bysubject(exp2))

# SEQUENTIAL CHANGE IN BEHAVIOR 

toplot_byitem <- function (data) {
  output <- data %>% 
    filter(type %in% c("prime", "crit")) %>%
    group_by(target, id, primetype) %>%
    summarize(Mean = mean(response),CILow=ci.low(response),CIHigh =ci.high(response),n=n()) %>%
    ungroup() %>%
    mutate(Ymin=Mean-CILow,Ymax=Mean+CIHigh)
  return(output)
}

toplot_byitem_exp2 <- toplot_byitem(exp2)

library(plyr)

toplot_byitem_exp2$id <- mapvalues(toplot_byitem_exp2$id, from = c("inherit","birthday","mail","party","reunion","vote","yoga","football","rain","car","son","golden","library","chairs","cookies","bus","foodtruck","beer","wine","indian","homework","hospital","education","calculus"),  to = rep(c("Prime 1", "Prime 2", "Prime 3", "Critical"), 6))

toplot_byitem_exp2$id <- factor(toplot_byitem_exp2$id, levels = c("Prime 1", "Prime 2", "Prime 3", "Critical"))
toplot_byitem_exp2$primetype <- relevel(factor(toplot_byitem_exp2$primetype), ref = "no")

detach("package:plyr", unload=TRUE) 

plot_means_byitem <- function (toplot) {
  ggplot(toplot, aes(x=id,y=Mean, fill = primetype)) +
    facet_wrap(~target) +
    geom_bar(stat="identity", position=dodge) +
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25,position=dodge) + 
    labs(x = "Trial type", y = "Interpretation\n(100 = maximum exhaustivity inference)") +
    ggtitle("Change in behavior from prime to critical trials\n(Experiment 2)") +
    scale_fill_discrete(name="Condition",
                        labels=c("No-prime", "Prime"))
}

plot_means_byitem(toplot_byitem_exp2)

# COMPARE EXP1 AND EXP2

df <- rbind(exp1, exp2)

df <- df %>% 
  filter(!(primetype == "no"))
  
plot_means_compare <- function (toplot) {
  ggplot(toplot, aes(x=primetype,y=Mean)) +
    facet_wrap(~target) +
    geom_bar(stat="identity",position = "dodge") +
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25, position = dodge) + 
    labs(x = "Experiment", y = "Interpretation\n(100 = maximum exhaustivity inference)") +
    ggtitle("Comparison of behavior on critical trials (Experiments 1 and 2)") +
    scale_x_discrete(labels=c("Experiment 1", "Experiment 2"))
}

plot_means_compare(toplot(df))

df$primetype <- relevel(factor(df$primetype), ref = "str")

m_exp1and2 <- lmer(response ~ primetype * target + (primetype|workerid), data = df %>% filter(type == "crit"))

summary(m_exp1and2)
