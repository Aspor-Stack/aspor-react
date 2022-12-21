echo 'Installing dependencies'

cd ./packages/aspor-odata-js
npm install

cd ../aspor-odata-js-react
npm install

cd ../aspor-react-system
npm install

cd ../../

bash build.sh



