

library(ggplot2)
library(gganimate)
library(ggsoccer)
library(tidyverse)


# Create a data frame for player movement
player_movement <- tibble(
  frame = 1:10,
  player_x = seq(50, 60, length.out = 10),
  player_y = seq(30, 40, length.out = 10)
)



p <- ggplot(player_movement) +
  annotate_pitch(dimensions = pitch_statsbomb) +
  geom_point(aes(x = player_x, y = player_y), size = 4, color = "blue") +
  transition_time(frame) +
  labs(title = "Frame: {frame}")

animate(p, fps = 5)
