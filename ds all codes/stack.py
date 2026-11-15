class Stack:
    def __init__(self, capacity=8):
        self.stack = []
        self.capacity = capacity

    def push(self, val):
        if len(self.stack) >= self.capacity:
            raise OverflowError("Stack Overflow!")
        self.stack.append(val)

    def pop(self):
        if not self.stack:
            raise IndexError("Stack Underflow!")
        return self.stack.pop()

    def peek(self):
        return self.stack[-1] if self.stack else None


# Testing Stack
s = Stack()

s.push(10)
s.push(20)
s.push(30)

print("Stack:", s.stack)
print("Top:", s.peek())

print("Popped:", s.pop())

print("Stack after pop:", s.stack)