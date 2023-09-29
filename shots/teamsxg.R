



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

# Initialize data frames
best_team_by_median_xG <- list()

# Fetch and process data
for(league in leagues){
  best_team <- data.frame()
  for(i in seq_along(urls[[league]])){
    data <- read_csv(urls[[league]][[i]])
    
    # Convert xG to numeric
    data$xG <- as.numeric(data$xG)
    
    # Calculate median xG per shot for each team
    home_xG_median <- data %>% filter(h_a == "h") %>% group_by(h_team) %>% summarise(median_xG = median(xG))
    away_xG_median <- data %>% filter(h_a == "a") %>% group_by(a_team) %>% summarise(median_xG = median(xG))
    
    team_xG_median <- bind_rows(mutate(home_xG_median, team = h_team), mutate(away_xG_median, team = a_team)) %>%
      group_by(team) %>% summarise(median_xG_per_shot = median(median_xG))
    
    # Get team with the highest median xG per shot in each season
    best_team_season <- team_xG_median %>% filter(median_xG_per_shot == max(median_xG_per_shot)) %>% mutate(season = paste0(as.numeric(substr(seasons[i], 1, 2)) + 2000 - 1, "-", substr(seasons[i], 3, 4)))
    
    # Add to the list
    best_team <- bind_rows(best_team, best_team_season)
  }
  best_team_by_median_xG[[league]] <- best_team
}

# Write data to CSV
for(league in leagues){
  write_csv(best_team_by_median_xG[[league]], paste0("best_team_by_median_xG_", league, ".csv"))
}
