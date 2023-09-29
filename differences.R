

# Load required packages
library(ggplot2)
library(ggsoccer)
library(dplyr)
library(readr)


library(showtext)
library(sysfonts)

font_add_google("EB Garamond", "ebgaramond")


showtext_auto()


# Load the data
season_2015 <- read_csv('https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/premier-league/shots_premier_league_1415.csv')
season_2016 <- read_csv('https://raw.githubusercontent.com/eddwebster/football_analytics/master/data/understat/shots/premier-league/shots_premier_league_2021.csv')
# Define the bin width
bin_width <- 0.02

# Bin the data from each season
season_2015_binned <- season_2015 %>%
  mutate(X_bin = cut(X, breaks = seq(0, 1, bin_width)), 
         Y_bin = cut(Y, breaks = seq(0, 1, bin_width))) %>%
  group_by(X_bin, Y_bin) %>%
  summarise(count_2015 = n(), .groups = 'drop')

season_2016_binned <- season_2016 %>%
  mutate(X_bin = cut(X, breaks = seq(0, 1, bin_width)), 
         Y_bin = cut(Y, breaks = seq(0, 1, bin_width))) %>%
  group_by(X_bin, Y_bin) %>%
  summarise(count_2016 = n(), .groups = 'drop')

# Join the two datasets
shot_difference <- full_join(season_2015_binned, season_2016_binned, by = c("X_bin", "Y_bin"))

# Calculate the difference
shot_difference <- shot_difference %>%
  mutate(percentage_difference = (count_2016 - count_2015) / count_2015 * 100)

# Convert the factor bins back to numeric for plotting
shot_difference <- shot_difference %>%
  mutate(X = as.numeric(gsub("\\((.*),.*\\]", "\\1", as.character(X_bin))) + bin_width / 2,
         Y = as.numeric(gsub("\\((.*),.*\\]", "\\1", as.character(Y_bin))) + bin_width / 2)

# Multiply X and Y by 100
shot_difference$X <- shot_difference$X * 100
shot_difference$Y <- shot_difference$Y * 100

# Filter out extreme values
shot_difference <- shot_difference %>%
  filter(abs(percentage_difference) <= 100)
 
library(grid)



# Create the plot
p <- ggplot(shot_difference) +
  annotate_pitch(fill = "#FCF5F5") +
  coord_flip(xlim = c(52,100)) +
  theme_pitch() +
  theme(plot.background = element_rect(fill = "#FCF5F5"),
        legend.background = element_rect(fill = "#FCF5F5")) +
  geom_tile(aes(x = X, y = Y, fill = percentage_difference), alpha=0.5) +
  scale_fill_gradient2(low = "#FF0000", high = "#0000FF", mid = "white", midpoint = 0, na.value = NA, 
                       guide = guide_colorbar(title = "% Change",
                                              title.position = "top", title.theme = element_text(family = "ebgaramond", size = 16, vjust = 4),
                                              label.theme = element_text(family = "ebgaramond", size = 16),
                                              label.position = "right",
                                              ticks = TRUE,
                                              frame.colour = "#FCF5F5",
                                              barwidth = 2,
                                              barheight = 18,
                                              labels = c("", "", ""))) +
  theme(legend.position = c(0.97, 0.5))



# Add title and caption
p <- p + labs(title = "Premier League: Percent Change in Number of Shots by Location Between 2014/15 and 2020/21")
             
# Style the title and caption
p <- p + theme(plot.title = element_text(family = "ebgaramond", size = 20, hjust = 0.5, vjust = 1))

# install the package if you haven't already
if (!require(stringr)) install.packages("stringr")

# load the package
library(stringr)

# Your existing caption
caption <- "Each cell represents a location on the pitch. The bluer it is, the more goals were scored from that location in the 2020/2021 season compared to the 2014/2015 season."

# Use strwrap to split the caption into roughly equal-length lines
caption_lines <- strwrap(caption, width = nchar(caption) %/% 2 +10)

# Combine the lines back together, adding a newline character between them
caption_final <- paste(caption_lines[1], caption_lines[2], sep = "\n")

p <- p + labs(caption = caption_final)

# Reduce font size
p <- p + theme(plot.caption = element_text(family = "ebgaramond", size = 18, hjust = 0.2, vjust =33))

# Add additional text
# Add additional text
# You'll need to adjust hjust and vjust to position your text
# You also might need to adjust the font size (here set to 3.5)
p <- p + annotate("text", x = Inf, y = Inf, label = "Data from Understat", hjust = 1.68, vjust =50, size =7, family = "ebgaramond")
p <- p + annotate("text", x = Inf, y = Inf, label = "Graph by NikosAng", hjust = 1.7, vjust =52, size =7, family = "ebgaramond")


# Render the plot
print(p)




#width=1920&height=1057
