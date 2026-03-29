/feed?page=1&limit => 1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 => 11-20;

skip = (page-1)*limit

// Adding a Custom Domain Name;

-purchased domain name from godaddy
-signup on cloudflare & add a new domain name
- change the name servers on godaddy and point it to cloudflare
- wait for sometime till your nameservers are updated
- Enable SSL for website

# Sending Emails via SES

- create a IAM user
- Give Acess to AmazonSESFullAcess
- AMAZON SES: Create an Identity
- Verify your domain name
- Verify an email address


