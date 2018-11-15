db.createUser(
  {
    user: "appuser",
    pwd: "appPassword",
    roles: [ { role: "readWrite", db: "firebird" } ]
  }
)