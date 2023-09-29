



# Load necessary libraries
library(tidyverse)

# Base URL
base_url <- "https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/"

# Seasons
seasons <- c("1415", "1516", "1617", "1718", "1819", "1920", "2021", "2122")

# Leagues and their corresponding URLs
leagues <- list(
  "premier-league" = "premier-league/shots_premier_league_",
  "la-liga" = "la-liga/shots_laliga_",
  "serie-a" = "serie-a/shots_serie_a_",
  "bundesliga" = "bundesliga/shots_bundesliga_"
)

# Fetch and process data
for(league in names(leagues)){
  
  # Prepare URLs
  urls <- paste0(base_url, leagues[[league]], seasons, ".csv")
  
  # Initialize data frame
  situation_percentage <- data.frame()
  
  for(url in urls){
    data <- read_csv(url)
    total_shots <- nrow(data)
    situations <- unique(data$situation)
    
    for(situation in situations){
      # Calculate the percentage of shots from each situation
      situation_shots <- sum(data$situation == situation, na.rm = TRUE)
      situation_percentage[basename(url), situation] <- situation_shots / total_shots
    }
  }
  
  # Write data to CSV
  write_csv(situation_percentage, paste0(gsub("-", "_", league), "_situation_percentage.csv"))
}
