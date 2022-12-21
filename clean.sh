echo 'Cleaning project'

cd ./packages/aspor-odata-js

rm package-lock.json
rm -r node_modules
rm -r build

cd ./packages/aspor-odata-js-react

rm package-lock.json
rm -r node_modules
rm -r build

cd ./packages/aspor-react-system

rm package-lock.json
rm -r node_modules
rm -r build