# gmelius-getting-started-nodejs

This example shows how to get started with [Gmelius API](https://gmelius.com/api).

This small application performs OAuth 2.0 authentication and then displays a Gmelius board.


## Prerequisites

### Fill in environment variables
Get your [API credentials](https://gmelius.io/account/api) and store them in a `.env` file:

```bash
CLIENT_ID=
CLIENT_SECRET=
```

### Configure your access to Gmelius API

Configure your [access to Gmelius API](https://gmelius.io/account/api) -> change to account/api:

- add the following redirect_uri : http://localhost:8080/callback
- add the following scope : https://api.gmelius.com/public/auth/boards/read

## Refinements

### Remove hardcoded values
First about authentication, two values are global in this example. Let us see how to change that for a real-life application:
- store the code verifier of PKCE in your framework's session mechanism. Notably if it is a cookie based solution, it should be httpOnly (not readable by javascript) and encrypted.
- permanently store the access token in association with the logged-in user. Also refresh dynamically after the access token one-hour lifetime. 

The [authentication documentation for Gmelius API](https://developers.gmelius.com/#gmelius-api-documentation-authentication) goes deeper into details on how to obtain a user access token and refresh it.

Second, the ID of the board to be displayed may be chosen from the list of a user boards. The example just shows the first board of the user.

### Display large boards

The example displays boards with no more than 50 cards per columns. In order to display more cards, you may change the parameters of the route to fetch cards for a columns.
Either use the `limit` parameter to define how much card maximum per column to get or paginate with the `from` parameter. See the [documentation](https://developers.gmelius.com/#list-all-column-cards) of `GET /auth/boards/columns/{id}/cards` for more details.

### Display other cards info

In this example, only the subject of each card is displayed, see the `format` function in `./utils/board.js`. This is probably not relevant. Gmelius offers mutliple metadata associated to a card. These metadata are written in the response of the route to fetch cards for a columns, see [here](https://developers.gmelius.com/#card-details).

Notably, you can select and display information about assignment, status, notes, tags of each card.

### Make the board interactive

In this example, the user of the app cannot change the board.

Notably, the app fetches each card but the user cannot add / change / remove cards. These actions corresponds to REST calls to Gmelius API other than GET. They are made possible by calls of respective types POST / PUT or PATCH / DELETE.

See the [description of boards endpoints](https://developers.gmelius.com/#gmelius-api-documentation-boards) on how to perform those actions. Note that is possible to interact with cards or columns and their metadata.

### Make the board real-time

Again, this example is simplified because the representation is static: if a user makes an action on the same board, directly in Gmail for example, after the board is displayed, this modification will not be reflected. And it is also true if you store a Gmelius board in a database in your backend somewhere.

This problem is addressed by webhooks, see [here](https://developers.gmelius.com/#gmelius-api-documentation-webhooks). Create a webhook associated to a board in order receive updates each time an action is made on a board.

## Credits

https://glitch.com/edit/#!/trello-oauth

https://github.com/panva/node-openid-client/

https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/static-files
