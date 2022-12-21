echo 'Changing version'

cd ./packages/aspor-odata-js
npm version patch

cd ../aspor-odata-js-react
npm version patch

cd ../aspor-react-system
npm version patch

cd ../../