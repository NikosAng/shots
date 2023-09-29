

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

# Initialize data frames
shots_data <- data.frame()
# Initialize variables
avg_shots_per_team <- data.frame()
avg_goals_per_team <- data.frame()


# Calculate average shots, goals and conversion rate per game for each season
for(i in seq_along(urls)){
  data <- read_csv(urls[[i]])
  
  # Create column for home or away team based on 'h_a' column
  data <- data %>% mutate(team = ifelse(h_a == "h", h_team, a_team))
  
  # Group data by team and match_id
  team_data <- data %>% group_by(team, match_id) %>% summarise(total_shots = n(), total_goals = sum(result == "Goal")) %>%
    group_by(team) %>% summarise(avg_shots = mean(total_shots), avg_goals = mean(total_goals)) %>% ungroup()
  
  # Calculate conversion rate
  team_data <- team_data %>% mutate(conversion_rate = avg_goals / avg_shots)
  
  # Add season column
  team_data <- team_data %>% mutate(season = seasons[i])
  
  # Bind rows to shots_data
  shots_data <- bind_rows(shots_data, team_data)
  
  # Group by season and calculate average conversion rate
  season_conversion_rate <- shots_data %>% 
    group_by(season) %>%
    summarise(avg_conversion_rate = median(conversion_rate))
}

# Write data to CSV
write_csv(shots_data, "shots_data.csv")











