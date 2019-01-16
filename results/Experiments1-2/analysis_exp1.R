library(tidyverse)
library(bootstrap)
library(formatR)
library(reshape)
library(lme4)
library(lmerTest)
library(lsmeans)

# HELPERS

theta <- function(x,xdata,na.rm=T) {mean(xdata[x],na.rm=na.rm)}

ci.low <- function(x,na.rm=T) {
  mean(x,na.rm=na.rm) - quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.025,na.rm=na.rm)}
ci.high <- function(x,na.rm=T) {
  quantile(bootstrap(1:length(x),1000,theta,x,na.rm=na.rm)$thetastar,.975,na.rm=na.rm) - mean(x,na.rm=na.rm)}

# EXPERIMENT 1 

setwd("~/Documents/GitHub/alts")

d <- read.csv("results/Experiments1-2/results.csv",header = TRUE, stringsAsFactors = FALSE)

d[d$target == "tasty",]$target <- "palatable"

d <- data.frame(lapply(d, function(x) {
  gsub('"', '', x)
}))

d <- data.frame(lapply(d, function(x) {
  gsub('\\\\', '', x)
}))

exp1 <- d %>%
  filter(Answer.list %in% c("list1_str", "list2_str"))

# Native language exclusion criteria

length(unique(exp1$workerid)) #should be 93

unique(exp1$language) # no one in exp1 needs to be excluded by virtue of native lang. 

# Control trial exclusion criteria

exp1$correct <- 0
exp1[exp1$id %in% c("high_right1","high_right2","high_right3"),]$correct <- "high"
exp1[exp1$id %in% c("low_right1","low_right2","low_right3"),]$correct <- "low"

exp1$response <- as.numeric(exp1$response)

# 14 people need to be excluded by virtue of failing one or more control trials

d_excl_exp1 <- exp1 %>%
  group_by(workerid, id, correct) %>%
  summarize(response) %>%
  filter((correct == "high" && response < 50) || (correct == "low" && response > 50)) %>%
  group_by(workerid) %>%
  summarize(n_mistakes = n()) %>%
  filter(n_mistakes > 1)

exp1 <- exp1 %>%
  filter(!(workerid %in% d_excl_exp1$workerid)) %>%
  filter(type %in% c("prime","crit"))

length(unique(exp1$workerid)) # should now be 79 

# NASTY DATA TRANSFORMING...

fillTheBlanks <- function(x, missing="na"){
  rle <- rle(as.character(x))
  empty <- which(rle$value==missing)
  rle$values[empty] <- rle$value[empty-1] 
  inverse.rle(rle)
}

exp1$primetype <- fillTheBlanks(exp1$primetype)

# BY CONDITION MEANS, EXP1  

# order scales by overall mean response

scale_means <- exp1 %>% 
  filter(type == "crit") %>%
  group_by(target) %>%
  summarize(mean = mean(response)) %>%
  arrange(mean)

exp1_rl <- exp1 %>% 
  mutate(target = relevel(target, "some"))

exp1$target <- factor(exp1$target, levels = scale_means$target)

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
    facet_wrap(~target, nrow = 1) +
    geom_bar(stat="identity",position = "dodge") +
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25, position = dodge) + 
    labs(x = "Condition", y = "Mean interpretation rating") +
    scale_x_discrete(labels=c("No-prime", "Prime"))
}

plot_means(toplot(exp1))

# LINEAR REGRESSION ANALYSIS

# OLD REGRESSION ANALYSIS

m_exp1 <- lmer(response ~ primetype * target + (primetype|workerid), data = exp1 %>% filter(type == "crit"))

summary(m_exp1)

# NEW ANALYSIS WITH CENTERED PRIMETYPE VARIABLE, NEW REF FOR TARGET (I.E. SCALE)

myCenter= function(x) {
  if (is.numeric(x)) { return(x - mean(x, na.rm=T)) }
  if (is.factor(x)) {
    x= as.numeric(x)
    return(x - mean(x, na.rm=T))
  }
  if (is.data.frame(x) || is.matrix(x)) {
    m= matrix(nrow=nrow(x), ncol=ncol(x))
    colnames(m)= paste("c", colnames(x), sep="")
    for (i in 1:ncol(x)) {
      m[,i]= myCenter(x[,i])
    }
    return(as.data.frame(m))
  }
}

exp1$primetype_centered <- myCenter(factor(exp1$primetype))

m_exp1_c <- lmer(response ~ primetype_centered * target + (primetype_centered|workerid), data = exp1_rl %>% filter(type == "crit"))

summary(m_exp1_c)

lsmeans(m_exp1_c, revpairwise~primetype_centered * target)

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
      primetype = c('no' = "No-prime condition", 'str' = "Prime Condition")
    )) +
    geom_line(data = subjectvar_bysubject, aes(group=workerid), color = "red", alpha = 0.5) + 
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25) +  
    geom_point(data = subjectvar_bysubject) +
    # ggtitle("By-subject change in behavior between priming and critical trials\n(Experiment 1)") +
    labs(x = "Trial type", y = "Mean interpretation rating") +
    scale_x_discrete(labels=c("Priming trials", "Critical trial"))
}

plot_subjectvar(toplot_subjectvar(exp1),toplot_subjectvar_bysubject(exp1))

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

toplot_byitem_exp1 <- toplot_byitem(exp1)

library(plyr)

toplot_byitem_exp1$id <- mapvalues(toplot_byitem_exp1$id, from = c("inherit","birthday","mail","party","reunion","vote","yoga","football","rain","car","son","golden","library","chairs","cookies","bus","foodtruck","beer","wine","indian","homework","hospital","education","calculus"),  to = rep(c("Prime 1", "Prime 2", "Prime 3", "Critical"), 6))

toplot_byitem_exp1$id <- factor(toplot_byitem_exp1$id, levels = c("Prime 1", "Prime 2", "Prime 3", "Critical"))
toplot_byitem_exp1$primetype <- relevel(factor(toplot_byitem_exp1$primetype), ref = "no")

detach("package:plyr", unload=TRUE) 

plot_means_byitem <- function (toplot) {
  ggplot(toplot, aes(x=id,y=Mean, fill = primetype)) +
    facet_wrap(~target) +
    geom_bar(stat="identity", position=dodge) +
    theme(axis.text.x=element_text(angle=20,hjust=1,vjust=1)) +
    geom_errorbar(aes(ymin=Ymin,ymax=Ymax),width=.25,position=dodge) + 
    labs(x = "Trial type", y = "Mean interpretation rating") +
    # ggtitle("Change in behavior from prime to critical trials\n(Experiment 1)") +
    scale_fill_discrete(name="Condition",
                        labels=c("No-prime", "Prime"))
}

plot_means_byitem(toplot_byitem_exp1)

