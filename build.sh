echo 'Building project'

cd ./packages/aspor-odata-js
npm run-script build

cd ../aspor-odata-js-react
npm run-script build

cd ../aspor-react-system
npm run-script build

cd ../../