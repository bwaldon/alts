symmetric_byitem_json <- toJSON(symmetric_byitem)

symmetric_bda <- webppl(paste("var itemData = ", symmetric_byitem_json, "\n", bda))

symmetric_posteriors <- (symmetric_bda$posteriors)$support

symmetric_predictions <- symmetric_bda$predictions

symmetric_byitem <- merge(symmetric_byitem, symmetric_predictions, by = "id")

colnames(symmetric_byitem)[colnames(symmetric_byitem)=="prediction"] <- "rsa_prediction"

# MERGE TO MAIN STUDY DATA FROM CONTROL CONDITION

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

control_bda <- webppl(paste("var itemData = ", control_byitem_json, "\n", bda))

# MERGE TO MAIN STUDY DATA FROM TARGET CONDITION

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

target_bda <- webppl(paste("var itemData = ", target_byitem_json, "\n", bda))

# MERGE TO MAIN STUDY DATA FROM NOT-TARGET CONDITION

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

nottarget_bda <- webppl(paste("var itemData = ", nottarget_byitem_json, "\n", bda))

# GET POSTERIOR DISTRIBUTIONS OF PARAMETER VALUES FROM RSA MODEL, E.G. ALPHA PARAMETER AND COST OF "IS AN X" FROM SYMMETRIC CONDITION

symmetric_posteriors <- (symmetric_bda$posteriors)$support
control_posteriors <- (control_bda$posteriors)$support
target_posteriors <- (target_bda$posteriors)$support
nottarget_posteriors <- (nottarget_bda$posteriors)$support

symmetric_posteriors$condition <- "symmetric"
control_posteriors$condition <- "control"
target_posteriors$condition <- "target"
nottarget_posteriors$condition <- "nottarget"

dat <- rbind(symmetric_posteriors, control_posteriors, target_posteriors, nottarget_posteriors)

ggplot(dat, aes(alpha, fill = condition)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred alpha parameter value", y = "Density") +
  ggtitle("Posterior distribution of alpha parameter values\n(Experiment 3)") 
ggplot(dat, aes(cost_istarget, fill = condition)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred cost of 'It's a [target]'", y = "Density") +
  ggtitle("Posterior distribution of cost values for 'It's a [target]'\n(Experiment 3)") 
ggplot(dat, aes(cost_nottarget, fill = condition)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred cost of 'It's not a [target]'", y = "Density") +
  ggtitle("Posterior distribution of cost values for 'It's not a [target]'\n(Experiment 3)") 
ggplot(dat, aes(cost_looksliketarget, fill = condition)) + geom_density(alpha = 0.2) +
  labs(x = "Inferred cost of 'It looks like a [target]'", y = "Density") +
  ggtitle("Posterior distribution of cost values for 'It looks like a [target]'\n(Experiment 3)") 
