



# Load necessary libraries
library(tidyverse)

# Base URL
base_url <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/"

# Seasons and Leagues
seasons <- c("1415", "1516", "1617", "1718", "1819", "1920", "2021", "2122")
leagues <- c("bundesliga", "laliga", "premier-league", "serie-a")

# Prepare URLs
urls <- list()
for (league in leagues){
  if(league == "premier-league"){
    urls[[league]] <- paste0(base_url, "premier-league/shots_premier_league_", seasons, ".csv")
  } else if(league == "serie-a"){
    urls[[league]] <- paste0(base_url, "serie-a/shots_serie_a_", seasons, ".csv")
  } else if(league == "laliga"){
    urls[[league]] <- paste0(base_url, "la-liga/shots_laliga_", seasons, ".csv")
  } else if(league == "bundesliga"){
    urls[[league]] <- paste0(base_url, "bundesliga/shots_bundesliga_", seasons, ".csv")
  }
}

# Initialize data frame
pass_layoff_goals_percentage <- data.frame(season = c("2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22"))

# Fetch and process data
for(league in leagues){
  pass_layoff_percentage <- c()
  for(url in urls[[league]]){
    data <- read_csv(url)
    # Calculate the percentage of goals from Pass or Layoff
    pass_layoff_goals <- sum((data$lastAction == "Pass" | data$lastAction == "LayOff"| data$lastAction == "Cross")& data$situation=='OpenPlay' , na.rm = TRUE)
    total_goals <- sum(data$situation=='OpenPlay', na.rm = TRUE)
    pass_layoff_percentage <- c(pass_layoff_percentage, pass_layoff_goals / total_goals)
  }
  pass_layoff_goals_percentage[[league]] <- pass_layoff_percentage
}

# Write data to CSV
write_csv(pass_layoff_goals_percentage, "pass_layoff_cross_goals_percentage.csv")
