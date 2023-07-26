# Read the list of names from the "ukBrandNames.txt" file
with open('ukBrandNames.txt', 'r') as file:
    brand_names = file.readlines()

# Remove single-letter names from the list and add a colon ":" after each word in the remaining names
brand_names = [name.strip() + ':' for name in brand_names if len(name.strip()) > 1]

# Remove any extra colons from the brand names
brand_names = [name.rstrip(':') + ':' for name in brand_names]

# Write the modified list back to the "ukBrandNames.txt" file
with open('ukBrandNames.txt', 'w') as file:
    file.write('\n'.join(brand_names))
