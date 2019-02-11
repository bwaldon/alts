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