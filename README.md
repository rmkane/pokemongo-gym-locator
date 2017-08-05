# Pokémon GO &mdash; Gym Locator

The main page presents the user with a search bar. A user can enter a Gym name, text to be searched for with the notes, and the area the Gym is located in.

Each search result can be clicked on to display a simple popup of the Gym; including name, address, image, coordinates, and notes. The window can be popped-out to produce a separate page which can be shared with other users.

The individual gym pages contain a list of nearby gyms with the closest ones at the top. Each nearby gym will display the distance from the current gym, along with the direction.

## Mod-Rewrite

Place `.htaccess` file in root directory of website. This site is currently designed to sit inside of a subdirectory.

```
RewriteEngine on
RewriteRule   ^pokemongo-gym-locator/search/(\w+[\w\s-'\(\)]+)/?$   pokemongo-gym-locator/search.html?q=$1   [NC,L]   # Handle search requests
RewriteRule   ^pokemongo-gym-locator/gym/(\w+[\w\s-'\(\)]+)/?$      pokemongo-gym-locator/gym.html?name=$1   [NC,L]   # Handle gym requests
```

## Future Work

Moving the data to the server and processing the request there instead of on the client.

## Contributing

If you would like to contribute to this, please ask.
