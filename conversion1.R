


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
avg_conversion_rate <- data.frame(season = c("2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22"))

# Fetch and process data
for(league in leagues){
  avg <- c()
  for(url in urls[[league]]){
    data <- read_csv(url)
    
    # Create column for home or away team based on 'h_a' column
    data <- data %>% mutate(team = ifelse(h_a == "h", h_team, a_team))
    
    # Group data by team and match_id
    team_data <- data %>% group_by(team, match_id) %>% summarise(total_shots = n(), total_goals = sum(result == "Goal")) %>%
      group_by(team) %>% summarise(avg_shots = mean(total_shots), avg_goals = mean(total_goals)) %>% ungroup()
    
    # Calculate conversion rate
    team_data <- team_data %>% mutate(conversion_rate = avg_goals / avg_shots)
    
    avg <- c(avg, mean(team_data$conversion_rate, na.rm = TRUE))
  }
  avg_conversion_rate[[league]] <- avg
}

# Write data to CSV
write_csv(avg_conversion_rate, "avg_conversion_rate.csv")
