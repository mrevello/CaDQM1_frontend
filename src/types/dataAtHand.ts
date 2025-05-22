export type DataAtHand = {
  id: number;
  name: string;
  description: string;
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
};

export type DataAtHandApiResponse = {
  id: number;
  name: string;
  description: string;
  url_db: string;
  user_db: string;
  pass_db: string;
};

export function toDataAtHand(response: DataAtHandApiResponse): DataAtHand {
  // Split into [ "host:port", "database" ]
  const [hostPort, database] = response.url_db.split("/");
  if (!hostPort || !database) {
    throw new Error(`Invalid url_db format: ${response.url_db}`);
  }

  // Split "host:port" into [ "host", "port" ]
  const [host, port] = hostPort.split(":");
  if (!host || !port) {
    throw new Error(`Invalid host:port in url_db: ${response.url_db}`);
  }

  return {
    id: response.id,
    name: response.name,
    description: response.description,
    host,
    port,
    database,
    user: response.user_db,
    password: response.pass_db,
  };
}
