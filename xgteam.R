

# Load necessary libraries
library(tidyverse)

# Season URLs
url_1415 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_1415.csv"
url_1516 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_1516.csv"
url_1617 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_1617.csv"
url_1718 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_1718.csv"
url_1819 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_1819.csv"
url_1920 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_1920.csv"
url_2021 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_2021.csv"
url_2122 <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/bundesliga/shots_bundesliga_2122.csv"

# URLs list
urls <- list(url_1415, url_1516, url_1617, url_1718, url_1819, url_1920, url_2021, url_2122)

# Seasons list
seasons <- c("2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22")

# Initialize variable
best_team_by_xg <- data.frame()

# Calculate average and median xG per shot for each team in each season
for(i in seq_along(urls)){
  data <- read_csv(urls[[i]])
  
  # Convert xG to numeric
  data$xG <- as.numeric(data$xG)
  
  # Add home and away xG
  home_xG <- data %>% filter(h_a == "h") %>% group_by(h_team) %>% summarise(total_xG = sum(xG), total_shots = n())
  away_xG <- data %>% filter(h_a == "a") %>% group_by(a_team) %>% summarise(total_xG = sum(xG), total_shots = n())
  
  # Combine home and away xG
  team_xG <- bind_rows(mutate(home_xG, team = h_team), mutate(away_xG, team = a_team)) %>%
    group_by(team) %>% summarise(total_xG = sum(total_xG), total_shots = sum(total_shots)) %>% 
    mutate(avg_xG_per_shot = total_xG / total_shots) 
  
  # Calculate median xG per shot for each team
  home_xG_median <- data %>% filter(h_a == "h") %>% group_by(h_team) %>% summarise(median_xG = median(xG))
  away_xG_median <- data %>% filter(h_a == "a") %>% group_by(a_team) %>% summarise(median_xG = median(xG))
  
  team_xG_median <- bind_rows(mutate(home_xG_median, team = h_team), mutate(away_xG_median, team = a_team)) %>%
    group_by(team) %>% summarise(median_xG_per_shot = median(median_xG))
  
  # Join average and median data
  team_xG <- inner_join(team_xG, team_xG_median, by = "team")
  
  # Get team with the highest average xG per shot in each season
  best_team <- team_xG %>% filter(avg_xG_per_shot == max(avg_xG_per_shot)) %>% mutate(season = seasons[i]) 
  
  # Add to the list
  best_team_by_xg <- bind_rows(best_team_by_xg, best_team)
}

# Write data to CSV
write_csv(best_team_by_xg, "best_team_by_xg.csv")
