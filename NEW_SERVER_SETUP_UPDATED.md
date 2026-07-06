# Setting Up Travelator On A Brand New Server

This is a step-by-step guide for wiping your DigitalOcean droplet (the remote computer this app runs on) and setting everything up again from scratch, on a clean, modern operating system.

Go slowly. Do one numbered step at a time. Don't skip ahead. If a step gives you an error, stop and figure that out before moving to the next one — don't just keep going and hope it works itself out.

Some words you'll see a lot:
- **Droplet** = DigitalOcean's name for a remote computer (server) that you rent. It's just a computer somewhere else that you control from your own computer over the internet.
- **SSH** = the way you "log in" to the droplet from your terminal, like remote-controlling it.
- **Terminal** = the black/white text window where you type commands. On the droplet, everything below happens in the terminal, after you've SSH'd in.
- **Domain / subdomain** = the web address people type in to reach your app, like `travel.example.com`. A subdomain is just a prefix added to a domain you already own (`travel.` in front of `example.com`).
- **DNS record** = an entry in your domain's settings that says "this address points to this computer's IP number." You edit this wherever you bought/manage your domain (Namecheap, GoDaddy, Cloudflare, etc.) — not on the droplet.
- **Certificate / TLS / HTTPS** = the padlock-icon security that makes a website "https://" instead of "http://". Getting one requires proving you own a domain, which is why Phase 0 has to happen before Phase 4.
- **pm2** = a program that keeps your app running in the background forever, and restarts it automatically if it crashes or the server reboots.
- **Reverse proxy** = a doorman program (we'll use one called **nginx**) that sits in front of all your apps. People type in a nice web address, and the doorman quietly forwards them to the right app running on the right port behind the scenes. It also means only ONE program (nginx) has to deal with the HTTPS padlock stuff, instead of every single app dealing with it separately.

---

Travelator secrets:

> Do **not** paste real secrets into this document — it is not gitignored and can be committed. Keep real values only in `src/config.json` and `api/aws-config.json`, both of which are gitignored.

## ./src/config.json  (frontend — browser-visible, non-secret Cognito IDs only)

{
  "cognito": {
    "REGION": "us-west-2",
    "USER_POOL_ID": "us-west-2_XXXXXXXXX",
    "APP_CLIENT_ID": "XXXXXXXXXXXXXXXXXXXXXXXXXX"
  }
}

## ./api/aws-config.json  (backend — all backend config + secrets live here)

The API no longer reads `src/config.json`; the DynamoDB table name and the
Cognito JWKS (`cognito-pub-keys`) it uses to verify tokens now live here.

{
    "region": "us-west-2",
    "endpoint": "https://dynamodb.us-west-2.amazonaws.com",
    "table": "Travelator-Itineraries",
    "accessKeyId": "OMIT_TO_USE_IAM_ROLE_OR_PUT_REAL_KEY_IN_GITIGNORED_FILE_ONLY",
    "secretAccessKey": "OMIT_TO_USE_IAM_ROLE_OR_PUT_REAL_KEY_IN_GITIGNORED_FILE_ONLY",
    "cognito-pub-keys": {
        "keys": [ "...paste from https://cognito-idp.<region>.amazonaws.com/<USER_POOL_ID>/.well-known/jwks.json..." ]
    }
}

---

## Phase 0 — Pick your subdomains first

This app runs as **two separate programs** — a frontend (the website people look at) and a backend (the API that saves/loads itineraries). They need **two different subdomains**, both pointing at the same droplet:

- **Frontend**, e.g. `travel.example.com`
- **Backend/API**, e.g. `api.travel.example.com`

Why two? The frontend's code (`src/config.json`) calls the backend by name over HTTPS, and the browser checks that the backend's security certificate matches the exact name it dialed. A certificate issued for `travel.example.com` would be rejected when the browser connects to the API, so the API needs its own name and its own certificate. Both names will point at the very same droplet IP — they're just two labels for the same computer, told apart by which program answers.

You don't need to do anything with them yet — just decide on the two names now. You'll point them at the droplet in Phase 4, once it has an IP address ready to point to.

---

## Phase 1 — Wipe the droplet and start fresh

1. Log into your DigitalOcean account in a web browser.
2. Find your droplet in the list and click into it.
3. Find the **Destroy** tab. DigitalOcean has renamed the option you want — look for **Restore base image** (not **Destroy**, **Restart**, or **Turn off**). This is the same thing this guide calls "Rebuild": it wipes the hard drive but keeps the same droplet and the same IP address, which saves us a step later. (If you don't see it there, check the droplet's **Settings** tab instead — DigitalOcean has moved this option around between UI versions.)
4. When it asks which operating system image to use, pick the newest **Ubuntu \_\_.04 (LTS)** available (e.g. 26.04 as of mid-2026) — Ubuntu puts out a new LTS every 2 years on even years, always in April, so whichever is newest at the time gives you the most years before you have to do this again. "LTS" means "long term support" — it's the safe, stable choice.
5. Confirm the rebuild. This will take a few minutes. Everything currently on the droplet will be erased — that's expected and fine, since you said nothing needs to be kept.
6. Once it's done, note down the droplet's **IP address** shown on its DigitalOcean page (a set of numbers like `164.90.123.45`). You'll need this in Phase 4.

---

## Phase 2 — Log in and set up the basics

1. Open your terminal on your own computer.
2. Log into the droplet by typing (replace the IP with your real one):
   ```
   ssh root@164.90.123.45
   ```
3. It's a brand new computer, so update it first:
   ```
   apt update && apt upgrade -y
   ```
   This can take a few minutes. Let it finish.
4. Install Node.js (the program that runs this app) and npm (the tool that installs the app's pieces):
   ```
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
5. Check it worked:
   ```
   node -v
   npm -v
   ```
   You should see version numbers printed, not an error.
6. Install pm2 (the "keep it running forever" tool):
   ```
   npm install -g pm2
   ```
7. Turn on the firewall so only the ports you need are open:
   ```
   ufw allow 22
   ufw allow 80
   ufw allow 443
   ufw allow 3000
   ufw allow 8080
   ufw enable
   ```
   (Port `3000` is the frontend and `8080` is the backend — both must be open or the browser will time out reaching the site. If you skip `3000`, you get `NS_ERROR_NET_TIMEOUT`.)
   Type `y` if it asks to confirm. (Port 22 is for your own SSH login — don't skip that one, or you'll lock yourself out.)

---

## Phase 3 — Get the app's code onto the droplet

1. Still in the same terminal (logged into the droplet), download the code:
   ```
   git clone <your-github-repo-url>
   ```
   Replace `<your-github-repo-url>` with the actual URL of this project on GitHub.
2. Move into the folder it created:
   ```
   cd travelator
   ```
3. Install the frontend's pieces:
   ```
   npm install
   ```
   **If this hangs for a long time and then the terminal just prints `Killed`:** your droplet ran out of RAM and Linux force-killed it (common on small/cheap droplets — `npm install` for a React app is memory-hungry). Add some temporary swap space so there's room to finish, then retry:
   ```
   fallocate -l 2G /swapfile
   chmod 600 /swapfile
   mkswap /swapfile
   swapon /swapfile
   echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
   ```
   Check it's active with `free -h` (you should see `2.0G` under `Swap`), then run `npm install` again. It'll be slower than normal since swap is much slower than real RAM, but it should finish instead of getting killed.

   Once both `npm install` steps below are done, you can remove the swap file again if you don't want it hanging around permanently (it's just a safety net for these installs, not something the running app needs):
   ```
   swapoff /swapfile
   rm /swapfile
   sed -i '/\/swapfile none swap sw 0 0/d' /etc/fstab
   ```
4. Install the backend's pieces:
   ```
   cd api
   npm install
   cd ..
   ```

---

## Phase 4 — Point your subdomain at the droplet, and get a padlock (HTTPS certificate)

1. Go to wherever you manage your domain's DNS (Namecheap, GoDaddy, Cloudflare, your domain registrar's website — not the droplet).
2. Add **two A records** (one for each subdomain from Phase 0), both pointing at the **same** droplet IP:
   - First record:
     - Name/Host: the frontend subdomain part only, e.g. `travel` (for `travel.example.com`)
     - Value/Points to: the droplet's IP address from Phase 1
     - TTL: leave as default
   - Second record:
     - Name/Host: the API subdomain part only, e.g. `api.travel` (for `api.travel.example.com`)
     - Value/Points to: the **same** droplet IP address
     - TTL: leave as default

   Notes: you enter only the part *in front of* your root domain — for `api.travel.example.com` the host is `api.travel` (a sub-sub-domain, which registrars allow). Some registrars auto-append your domain, so don't type `.example.com` yourself or you'll end up with it doubled. Both records use the identical IP on purpose.
3. Save both. DNS changes can take anywhere from a few minutes to an hour to "propagate" (spread across the internet). Check if they're ready by running this on your own computer for **each** name:
   ```
   ping travel.example.com
   ping api.travel.example.com
   ```
   If each one replies with your droplet's IP address, it's ready. If not, wait a bit and try again. Both must resolve before the next step, or certbot will fail.
4. Back on the droplet, install certbot (the tool that gets free HTTPS certificates):
   ```
   apt install -y certbot
   ```
5. Get a certificate for **each** subdomain (replace with your real names — run both commands):
   ```
   certbot certonly --standalone -d travel.example.com
   certbot certonly --standalone -d api.travel.example.com
   ```
   If it complains that port 80 is in use, make sure nothing else is running on the droplet yet (it shouldn't be, since it's freshly rebuilt).
6. Certbot saves each certificate in a folder named after its subdomain, usually like:
   ```
   /etc/letsencrypt/live/travel.example.com/...        <- frontend cert
   /etc/letsencrypt/live/api.travel.example.com/privkey.pem
   /etc/letsencrypt/live/api.travel.example.com/fullchain.pem
   /etc/letsencrypt/live/api.travel.example.com/chain.pem
   ```
   Keep the **API** subdomain's paths in mind — that's the one the backend reads, and you'll point the app at it in Phase 5.
7. **Good news:** certbot automatically sets up its own renewal schedule so the certificate renews itself every ~60 days. You do not need to build this yourself. You only need one extra step so the app restarts and picks up the new certificate after each renewal:
   ```
   echo '#!/bin/bash
   pm2 restart travelator-api travelator-frontend' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/restart-app.sh
   sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/restart-app.sh
   ```
   That's it — certbot will run this automatically every time it renews, forever, with no cron job for you to write or maintain.

---

## Phase 5 — Tell the app its secret settings

This app doesn't come with real login/database settings built in — you have to provide your own by copying two "template" files and filling them in.

1. Copy the frontend template:
   ```
   cp src/config-model.json src/config.json
   ```
2. Open `src/config.json` in a text editor and fill in your real AWS Cognito (login system) details. If you don't have these yet, that's a separate AWS setup task — the app's login won't work without them, but everything else can still run.
3. Copy the backend template:
   ```
   cp api/aws-config-model.json api/aws-config.json
   ```
4. Fill in your real AWS/DynamoDB (database) details in that file too.
5. Point the backend at your **API** subdomain's certificate. In `api/index.js`, find the three `certOpts` paths near the bottom and replace `api.travelator.pro` with your real API subdomain (e.g. `api.travel.example.com`) in all three lines:
   ```js
   const certOpts = {
       key:  fs.readFileSync('/etc/letsencrypt/live/api.travel.example.com/privkey.pem'),
       cert: fs.readFileSync('/etc/letsencrypt/live/api.travel.example.com/fullchain.pem'),
       ca:   fs.readFileSync('/etc/letsencrypt/live/api.travel.example.com/chain.pem')
   };
   ```
   These must match whatever name you ran certbot with in Phase 4, since certbot names the folder after the subdomain.
6. Point the frontend at your API subdomain. This is **not** a code change — the address already lives in config. In `src/config.json`, set the `api.host` value to your API subdomain (keep the `https://`, no trailing slash):
   ```json
   "api": {
       "host": "https://api.travel.example.com",
       "port": 8080
   }
   ```
   (The frontend builds its request URLs from `api.host` + `api.port`; you never edit the component files for this.)

---

## Phase 6 — Build the frontend, then start everything up

**Do not run the Vite dev server in production.** `npm start` launches Vite's *development* server, which recompiles your code on the fly and keeps the whole project in memory — it's built for a developer's laptop and will pin the CPU and exhaust RAM on a small droplet (it can crash-loop under pm2 and drive the box to 100% CPU). Instead you **build** the frontend once into plain static files, then serve those files with a lightweight server (`vite preview`), which uses almost no CPU or memory.

First, make sure the frontend's domain is set. `vite.config.mjs` reads `server.domain` from `src/config.json` to find its HTTPS certificate (from Phase 4), so confirm that value is your real frontend subdomain:
```json
"server": {
    "domain": "travel.example.com",
    "port": 3000
}
```

1. Make sure you're in the main `travelator` folder:
   ```
   cd ~/travelator
   ```
2. Build the frontend into static files (this creates the `build/` folder Vite will serve). This step is memory-hungry — if it prints `Killed`, add swap the same way as in Phase 3, then rerun:
   ```
   npm run build
   ```
3. Start the frontend — this serves the pre-built `build/` folder over HTTPS, **not** the dev server:
   ```
   pm2 start npm --name travelator-frontend -- run preview
   ```
   (`npm run preview` runs `vite preview --host --port 3000` — those flags are baked into the `preview` script in the root `package.json`. **They're required:** `vite preview` is a different server from the dev server and *ignores* `server.port` from your config — without `--port` it defaults to `4173`, and without `--host` it binds to localhost only, so the site is unreachable from a browser. The certificate comes from `vite.config.mjs` as before. This serves the static `build/` folder, not the dev compiler.)
4. Start the backend — this runs the plain `node` service directly, **not** a dev file-watcher:
   ```
   cd api
   pm2 start index.js --name travelator-api
   cd ..
   ```
   (Note: don't start the backend with `npm start` via a watcher like `nodemon` — that's a development tool that restarts on every file change and wastes resources. `pm2 start index.js` runs `node index.js` straight, which is all a running server needs. `npm run dev` is available if you ever want the auto-restart watcher during local development, but never in production.)
5. Save this so it survives a reboot:
   ```
   pm2 save
   pm2 startup
   ```
   It will print one more command — copy and paste exactly what it prints and run that too. This is normal and expected.

**When you change frontend code later:** the running server holds the *old* build, so rebuild and restart it:
```
npm run build
pm2 restart travelator-frontend
```
(The backend has no build step — for backend code changes just `pm2 restart travelator-api`.)

---

## Phase 7 — Check that it actually works

1. Open a web browser and go to `https://travel.example.com:3000` (your subdomain, the port the frontend runs on).
2. You should see the app load.
3. Try logging in / saving an itinerary to make sure the backend connection (port 8080) is working too.
4. If something doesn't load, check the logs:
   ```
   pm2 logs travelator-frontend
   pm2 logs travelator-api
   ```
   The error messages there will tell you what's wrong.

---

## Bonus: Hosting Several Apps On One Droplet (Portfolio Setup)

If you plan to run this app plus other little side-project apps on the same droplet — like a personal portfolio of things to show friends or potential employers — you don't need a separate droplet for each one. A tiny "micro" droplet can handle several small, low-traffic apps at once, as long as you set it up the smart way. Here's how.

### Why do this at all?

Right now, this app's backend (`api/index.js`) handles its own HTTPS padlock stuff directly in the code, with the certificate file paths typed right into the file. That's annoying to repeat for every single app you host. Instead, we're going to install one helper program called **nginx** that handles HTTPS for ALL your apps in one place. Each of your apps then gets to be "boring" — it just runs on a plain, non-secure port like `3001` or `4000`, and nginx is the only thing on the internet-facing side.

Think of it like an apartment building: nginx is the front door and doorman. Each app is a tenant in their own apartment (their own port number). Visitors ring the doorman (nginx) with a name (the web address they typed), and the doorman walks them to the correct apartment. Nobody has to install their own front door.

This barely uses any extra computer resources — nginx is tiny (a few MB of memory), so it won't meaningfully slow anything down, even on the cheapest droplet.

### Step 1 — Install nginx

On your droplet, in the terminal:
```
sudo apt update
sudo apt install -y nginx
```

Check it's running:
```
sudo systemctl status nginx
```
You should see the word `active (running)` in green. Press `q` to get back out of that screen.

You can also just visit `http://<your-droplet-ip>` in a browser right now — you should see a plain "Welcome to nginx!" page. That means it's working.

### Step 2 — Point a subdomain at each app you want to host

For every app (including this one), add a DNS **A record** at your domain registrar (same as Phase 4 above), pointing a different subdomain at the same droplet IP address. For example:
```
travel.example.com      -> your droplet's IP
otherapp.example.com    -> your droplet's IP
portfolio.example.com   -> your droplet's IP
```
All of these can point at the exact same IP address — nginx is what will tell them apart later, based on the name typed in the address bar.

### Step 3 — Make sure each app runs on its own plain (non-HTTPS) port

Each app should just run normal, boring, non-secure `http://` on its own port, managed by pm2 like before. For example:
- Travelator frontend → port `3000`
- Travelator backend → port `8080` (but with the HTTPS/certificate code removed — see the note at the bottom of this section)
- Some other app's frontend → port `4000`
- Some other app's backend → port `4001`

Nginx is what will add the padlock (HTTPS) on top, so the apps themselves don't need to.

### Step 4 — Tell nginx how to route each subdomain to each port

For each app, create one small config file. Here's an example for this Travelator app's frontend, pointing `travel.example.com` at port `3000`:

```
sudo nano /etc/nginx/sites-available/travelator-frontend
```

Paste this in (replace `travel.example.com` with your real subdomain):
```
server {
    listen 80;
    server_name travel.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Save and exit (in `nano`, that's `Ctrl+O`, then `Enter`, then `Ctrl+X`).

Now do the same thing for the backend, in a separate file, e.g. `/etc/nginx/sites-available/travelator-api`, but with `server_name api.travel.example.com;` (a second subdomain, for the backend specifically) and `proxy_pass http://localhost:8080;`.

Repeat this same pattern — one small file, one subdomain, one port — for every other app you want to host.

### Step 5 — Turn each config "on"

Nginx only uses configs that are linked into a special `sites-enabled` folder. For each file you made:
```
sudo ln -s /etc/nginx/sites-available/travelator-frontend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/travelator-api /etc/nginx/sites-enabled/
```

Then check nginx is happy with your configs, and restart it:
```
sudo nginx -t
sudo systemctl restart nginx
```
`nginx -t` should print `syntax is ok` and `test is successful`. If it prints an error instead, it will tell you which file and which line has a typo — go fix that before restarting.

### Step 6 — Get free HTTPS padlocks for everything, in one shot

Certbot has a plugin that talks directly to nginx and edits these config files for you automatically:
```
sudo apt install -y python3-certbot-nginx
sudo certbot --nginx -d travel.example.com -d api.travel.example.com
```
Add more `-d yourapp.example.com` entries for every other subdomain you're hosting, all in that same command, or just re-run certbot again later for each new app as you add them.

Certbot will automatically update your nginx config files to add HTTPS, and (as before) sets up its own automatic renewal — you still don't need to build any cron jobs yourself.

### Step 7 — Adding a new app later

Once this is all set up, adding another showcase app later is just:
1. Run the new app on its own free port, managed by pm2, like `pm2 start index.js --name new-app-api`.
2. Point a new subdomain at the droplet (Step 2).
3. Make one new small nginx config file (Step 4), turn it on (Step 5).
4. Run certbot once for that new subdomain (Step 6).

That's it — you never touch the other apps' configs, and nginx keeps all of them separated and organized.

**Important note about this specific app:** since `api/index.js` currently starts its OWN HTTPS server with hardcoded certificate file paths, you'd need to change it to just be a plain, boring `http` server (remove the `https.createServer(certOpts, app)` part and the cert file reading, and just do `app.listen(8080, ...)` instead) before putting nginx in front of it. Otherwise you'd have two things both trying to do HTTPS, which will just cause confusion and errors. This is a one-time code change, not something you have to repeat per app.

---

## Making this easier next time: reduce the hardcoded stuff

Right now, several important settings are typed directly into the code instead of living in a config file. That's why every time you move to a new server or domain, you end up hand-editing source files. Here's what to change so future-you has a much easier time:

1. **Add a `server` section to `src/config-model.json`**, something like:
   ```json
   "server": {
       "domain": /* your subdomain, e.g. travel.example.com */,
       "apiPort": /* e.g. 8080 */,
       "frontendPort": /* e.g. 3000 */
   }
   ```
   Then update `api/index.js` to read the domain and port from this config file instead of the hardcoded `api.travelator.pro` cert paths and the hardcoded `8080`.

2. **Build the certificate paths from that domain value**, instead of typing the full path each time:
   ```js
   const domain = config.server.domain;
   const certOpts = {
       key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`),
       cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/fullchain.pem`),
       ca: fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`)
   };
   ```
   Now moving to a new domain is a one-line config change, not a source code edit.

3. **The frontend API address is already out of the code** — it lives in `src/config.json` under `api.host` / `api.port`, and `Body.js` / `LoadItinerary.js` build their request URLs from those values. So changing domains here is already just a one-line config edit (Phase 5, step 6), not a source change. Nothing to do; noted only so you don't go hunting for hardcoded URLs in the components that aren't there.

4. **Consider moving the DynamoDB table name and AWS region into the same shared config** rather than keeping two separate near-duplicate files (`src/config-model.json` and `api/aws-config-model.json` both end up needing region/table info) — one shared config file reduces the chance of the two getting out of sync.

None of this changes what the app *does* — it just moves settings that currently live inside the code into files that are easy to edit without touching source, which is exactly what you'll want the next time you rebuild a server or change domains.
