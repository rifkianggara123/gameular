import pygame
import random

pygame.init()

WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLACK = (0, 0, 0)

WIDTH, HEIGHT = 600, 400
BLOCK_SIZE = 20
SPEED = 10

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake Game")

clock = pygame.time.Clock()

def draw_snake(snake_list):
    for block in snake_list:
        pygame.draw.rect(screen, GREEN, [block[0], block[1], BLOCK_SIZE, BLOCK_SIZE])

def game_loop():
    x, y = WIDTH // 2, HEIGHT // 2
    dx, dy = 0, -BLOCK_SIZE
    snake = [[x, y]]
    snake_length = 1

    food_x = random.randint(0, (WIDTH - BLOCK_SIZE) // BLOCK_SIZE) * BLOCK_SIZE
    food_y = random.randint(0, (HEIGHT - BLOCK_SIZE) // BLOCK_SIZE) * BLOCK_SIZE

    running, game_over = True, False

    while running:
        while game_over:
            screen.fill(WHITE)
            font = pygame.font.SysFont(None, 50)
            text = font.render("Game Over! Press Q to Quit or C to Restart", True, RED)
            screen.blit(text, [WIDTH // 10, HEIGHT // 2])
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        running = False
                        game_over = False
                    if event.key == pygame.K_c:
                        game_loop()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT and dx == 0:
                    dx, dy = -BLOCK_SIZE, 0
                elif event.key == pygame.K_RIGHT and dx == 0:
                    dx, dy = BLOCK_SIZE, 0
                elif event.key == pygame.K_UP and dy == 0:
                    dx, dy = 0, -BLOCK_SIZE
                elif event.key == pygame.K_DOWN and dy == 0:
                    dx, dy = 0, BLOCK_SIZE

        x += dx
        y += dy

        if x >= WIDTH or x < 0 or y >= HEIGHT or y < 0:
            game_over = True

        for block in snake[:-1]:
            if block == [x, y]:
                game_over = True

        snake.append([x, y])
        if len(snake) > snake_length:
            del snake[0]

        if x == food_x and y == food_y:
            snake_length += 1
            food_x = random.randint(0, (WIDTH - BLOCK_SIZE) // BLOCK_SIZE) * BLOCK_SIZE
            food_y = random.randint(0, (HEIGHT - BLOCK_SIZE) // BLOCK_SIZE) * BLOCK_SIZE

        screen.fill(BLACK)
        pygame.draw.rect(screen, RED, [food_x, food_y, BLOCK_SIZE, BLOCK_SIZE])
        draw_snake(snake)
        pygame.display.update()
        clock.tick(SPEED)

    pygame.quit()
    quit()

game_loop()
