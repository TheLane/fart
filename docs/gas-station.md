# Gas Station

Gas Station is the first networked registry for Fart Bag. It is intentionally small: the registry uses Node.js HTTP and a filesystem backend, so the protocol can evolve before a public hosted service is introduced.

## Start a registry

~~~text
fart station
~~~

The default address is `http://127.0.0.1:4873`.

Use another port with `fart station 9000`.

## Publish

From a package directory containing `fart.json`:

~~~text
fart bag publish
~~~

Set a different registry with `FART_STATION_URL`.

## Search

~~~text
fart bag search
fart bag search math
~~~

## Install

Local packages still work with `fart bag install ../some-package`.
If the argument is not a local directory, Fart asks Gas Station for that bag:

~~~text
fart bag install hello-bag
~~~

The registry URL is controlled by `FART_STATION_URL`.

## Registry API

- `GET /packages` — list packages; optional `?q=query`
- `GET /packages/<name>` — retrieve the latest published version
- `GET /packages/<name>?version=<version>` — retrieve a specific version
- `POST /packages` — publish a package

Packages are stored as JSON with base64-encoded files. This is deliberately a development registry rather than a production hosting design.

## Security boundary

The current Gas Station is suitable for local development and experiments. It has no authentication, signing, access control, TLS termination, or malware scanning. A future hosted Gas Station should add those before accepting arbitrary third-party packages.
