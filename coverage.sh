NODE_ENV=test node_modules/.bin/nyc -i source-map-support/register -e .ts --reporter html \
  ts-mocha --reporter dot -p tsconfig.json test/*.spec.ts test/**/*.spec.ts \
&& node_modules/.bin/nyc report \
&& open coverage/index.html \
&& rm -rf .nyc_output


