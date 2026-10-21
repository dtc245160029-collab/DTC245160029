# Loki, Promtail and LogQL

## Query 1: View Nginx logs
```logql
{job="nginx"}
{job="nginx"} |~ `" 500 [0-9]+ "`
{job="docker", project="booking-tour"}
Q
