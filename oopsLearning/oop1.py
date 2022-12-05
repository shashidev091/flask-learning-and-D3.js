from typing import List, Optional
class Student:
    money = 0

    def __init__(self, name="Shashi"):
        self.name = name
        self.items = []
        self.money = 20

    def full_name(self):
        return self.name + ' Bhagat'

    def add_items(self, name, price):
        self.items.append({
            'name': name,
            'price': price
        })

    def sum_all_items(self):
        print(self.money)
        print(sum([item.get('price') for item in self.items]))

    def return_new(self):
        print(f"This is a great {self.name!r}")
