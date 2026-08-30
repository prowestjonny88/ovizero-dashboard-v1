import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the incorrectly placed useEffect
content = content.replace('''
  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);''', '')

# Insert it after currentScreen is declared
content = content.replace(
    "const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.COMMAND_CENTER);",
    "const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.COMMAND_CENTER);\n\n  // Scroll to top on screen change\n  useEffect(() => {\n    window.scrollTo({ top: 0, behavior: 'smooth' });\n  }, [currentScreen]);\n"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

