##FAQ
###How do I add a new feature?
 1. Add your new partition of data initial states definition of your redux store.
 2. Add a new duck (actions, reducer, selectors) for your new partition of the stor in src/store/modules.
 3. Add your new reducer to combineReducers in rducers/index.js
 4. Add new components (pages, routes, ui) to implement your feature using your new store interfaces created in step 2.
