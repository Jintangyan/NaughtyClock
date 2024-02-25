import random

# List of motivational phrases
motivational_phrases = [
    "All our dreams can come true, if we have the courage to pursue them. —Walt Disney",
    "The secret of getting ahead is getting started. —Mark Twain",
    "I’ve missed more than 9,000 shots in my career... —Michael Jordan",
    "Don’t limit yourself... —Mary Kay Ash",
    "The best time to plant a tree was 20 years ago... ―Chinese Proverb",
    "Only the paranoid survive. —Andy Grove",
    "It’s hard to beat a person who never gives up. —Babe Ruth",
    "I wake up every morning and think to myself... —Leah Busque",
    "We need to accept that we won’t always make the right decisions... ―Arianna Huffington",
    "Write it. Shoot it. Publish it. Crochet it. Sauté it. Whatever. MAKE. —Joss Whedon",
    "If people are doubting how far you can go... —Michele Ruiz"
]

def get_random_motivation():
    return random.choice(motivational_phrases)
