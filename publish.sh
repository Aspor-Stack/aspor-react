bash setup.sh
bash version-patch.sh

echo 'Publishing project'

cd ./packages/aspor-odata-js/build
npm publish --access public

cd ../../aspor-odata-js-react/build
npm publish --access public

cd ../../aspor-react-system/build
npm publish --access public

cd ../../../