import csv

# Replace 'biggest_companies_noe_nof.csv' with the actual path to your CSV file
csv_file = 'biggest_companies_noe_nof.csv'
output_file = 'company_names.txt'

# List to store company names
company_names = []

# Read the CSV file and skip the first row (header)
with open(csv_file, 'r', newline='', encoding='utf-8') as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Skip the header row
    for row in csv_reader:
        company_names.append(row[0])

# Add a colon (:) to the end of each word in the list
company_names = [name + ':' for name in company_names]

# Write the company names to a text file
with open(output_file, 'w', encoding='utf-8') as file:
    for name in company_names:
        file.write(name + '\n')

print(f"Company names extracted and saved to '{output_file}'.")
