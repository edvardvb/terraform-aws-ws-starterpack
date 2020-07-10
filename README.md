# Webapp i AWS med terraform
En implementasjon av infratrukturen fra https://immutablewebapps.org/

Basert på @kleivane's workshop: https://github.com/kleivane/terraform-aws-ws/


## Forberedelser

- Opprett en fork av dette repoet på din egen bruker og klon det ned på egen maskin
- Sjekk at `node` og `npm` er installert
- `brew install awscli`
- `brew install terraform`
- Opprett en AWS-konto på https://aws.amazon.com/.
    - Bruk Basic-versjonen
    - Legg inn betalingskort <- følg med på kostnadene og husk å slette infrastrukturen som koster penger når dagen er ferdig
    - Sjekk at du kommer inn på [S3](https://s3.console.aws.amazon.com/s3/home) uten å bli bedt om mer signup  
- Opprett en ny bruker i [IAM](https://console.aws.amazon.com/iam/home?#/users).
    - Add user: username `terraform` og access type `Programmatic access`
    - Permissions: `Attach existing policies directly` og velg policyen med policy name `AdministratorAccess`
    - Tags: name = `system` og value=`terraform`
    - Etter Create,husk å last ned access-key og secret.
- Kjør kommandoen `aws configure` med ACCESS_KEY_ID og SECRET_ACCESS_KEY som du fikk fra brukeren over. Bruk region `eu-north-1`
    - Kommandoen `aws iam get-user` kan brukes som en ping og sjekk av alt ok!
    - Når vi senere skal bruke terraform til å sette opp vår infrastruktur, er det credentials konfigurert gjennom aws-cliet over som terraform også bruker som credentials


## Bli kjent

### Om appen

### Lokal oppstart

* Kjør opp appen med `npm install && npm run start`
* Gjør deg kjent med hvor de forskjellige inputene og env-variablene i appen kommer fra

## Min første webapp i skyen

Felles mål her er en webapp med to S3-buckets og et CDN foran som hoster index.html og kildekode.

Nyttige lenker:
* Om du ikke er veldig kjent i aws-konsollen fra før, anbefaler jeg å sjekke ut de forskjellige servicene
underveis
    - https://console.aws.amazon.com/s3
    - https://console.aws.amazon.com/cloudfront
    - https://console.aws.amazon.com/route53
* [Terraform-docs](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html)
* [AWS-cli-docs](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html)


### Testmiljø med buckets

Opprett to [buckets](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html) med terraform som skal bli der vi server asset og host. Start i `terraform/test/main.tf`. Husk at S3-bucketnavn må være unike innenfor en region!

Noter denne terraform-outputen for begge buckets:
* bucket_domain_name - denne lenken kan du bruke til å aksessere filene du har lastet opp
* id - navnet på bucketen du har opprettet

Når begge bucket er oppprettet uten mer oppsett, og du kan gå inn i konsollen på web og manuelt laste opp en tilfeldig fil. Den vil ikke tilgjengelig på internett via `bucket_domain_name/filnavn`, ettersom default-policyen er at bucket er private. Vi kan konfigurere public tilgang ved å bruke acl-parameteret på en bucket eller en bucket policy. Sistnevnte er anbefalt av AWS  ettersom bucketacl er et eldre og skjørere konsept.


### Åpne buckets for automatisk opplasting med policies

Dersom du satte acl-parameteret på bøttene kan du fjerne det før dette steget.

Opprett bucketpolicies for begge bøttene ved å bruke [`aws_s3_bucket_policy`](https://www.terraform.io/docs/providers/aws/r/s3_bucket_policy.html). I policy-atributtet kan du bruke en [templatefile](https://www.terraform.io/docs/configuration/functions/templatefile.html) med fila `policy/public_bucket.json.tpl`. Denne trenger en variabel `bucket_arn`. Bruk atributtet fra bucketen for å sende inn rett arn.

Se [policy.md](terraform/test/policy/policy.md) for en forklaring på innholdet i policyen.


### npm run upload-assets

Gjør endring i `upload-assets.js` og sett navn inn rett navn på bucket. Som version kan du beholde 1 forelpig. Kjør scriptet med `npm run upload-assets` og sjekk at du får den bygde `main.js` lastet opp i bøtta og public tilgjengelig på nett.


### npm run deploy-test

Gjør endring i `deploy-env.js` og sett navn inn rett navn på bucket og rett url til assets-bucket. Som version kan du beholde 1 *eller* sette samme versjon som du gjorde i steget over. Kjør scriptet med `npm run deploy-test` og sjekk at du får den bygde `index.html` lastet opp i bøtta og public tilgjengelig på nett.

Denne fila skal du nå kunne åpne fra bucketen og se appen :rocket:

### Redeploy

Dersom du kjører `npm run deploy-test` med samme versjonsnummer en gang til, vil du se at `Build deploy at` endrer seg, mens fargen, heading og `Build created at` er den samme.

### Ny versjon

Prøv å gjør en endring i koden og deploy en ny versjon! Hvilket tall du velger spiller ingen rolle, men husk å oppdatere versjonen både i `upload-assets.js` og `deploy-env.js`

Løsningsforslag i repoet frem til hit ligger under https://github.com/kleivane/immutable-webapp/tree/master/terraform/test-1 .

### Vil du fortsette mere?

* Lag et prodmiljø ved å lage en ny host-bucket. Da kan den peke på en annen versjon av assets, og vipps har man to miljøer!
* Trekk ut bygging av index.html til en lambda
    * Lambdaen trenger kildekode i egen bucket
    * Provisjoner lambda med terraform pr miljø og send inn versjon av kildekoden som skal brukes


# Notater

## Lage Starterpack

* Klone repoet git clone <ssh> starterpack
* Slett .git-mappa
* Slett stuff under terraform (behold test/main og test/output og test/policy)
* Lag et nytt repo på github
* Slett notatene her
* Kjør git init, add, commit, push til nytt repo
