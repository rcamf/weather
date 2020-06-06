# Projekttag: Leistungskurs Informatik, 06.03.2020 extended version
##### [Original](https://gitlab.com/paul.heising/schuelertag-ema-2020/)
Dieses Projekt ist im Rahmen einer Exkursion meines Informatik-Leistungskurses enstanden. Im nachhinein habe ich die Api überarbeitet und eine neue Version der Website hinzugefügt. Das Repository steht frei zur Verfügung. Wenn du Bugs findest, kannst du dich gerne bei mir melden oder ein Issue aufmachen. Für Pull Requests müssen die Commits übersichtlich dokumentiert sein, dann nehme ich die Änderung gerne auf.
## Installation
Zuerst musst du das Programm [Git][1] installieren. Git brauchst du, um die Dateien aus diesem Repository auf deinen Rechner zu bekommen. Dafür musst du nur in einen Ordner deiner Wahl navigieren und den folgenden Befehl ausführen.
```bash
git clone https://github.com/cfRIKO/weather.git
```
Nachdem der Download abgeschlossen ist, hast du zwei Möglichkeiten. Entweder du führst die Website und die Api direkt auf deinem Rechner aus und folgst dem Ausführen mit NodeJS oder du nutzt Docker und Docker-Compose, um die Website und Api in einem Container auf deinem Rechner auszuführen.
### Ausführen mit NodeJS
Damit du die Website und die Api direkt auf deinem Rechner ausführen kannst, musst du dir die Long-Term-Support (LTS) Version von [NodeJS][2] herunterladen. NodeJS ist eine Laufzeitumgebung, die dir ermöglich Javascript außerhalb deines Browsers auszuführen. Anschließend öffnest du die Ordner "weather/website" und "weather/api" jeweils in einer Kommandozeile und führst in beiden Fenstern folgenden Befehl aus.
```bash
npm install
```
Dieser Befehl lädt alle Packete herunter die von der Website oder der Api gebraucht werden. Um jetzt die Website zu starten, musst du in der Kommandozeile der Website folgendes ausführen.
```bash
npm start
```
Zum Starten der Api musst du in der anderen Kommandozeile folgenden Befehl ausführen.
```bash
npm run dev
```
Nachdem beide Programme gestartet wurden, musst du einige Zeit warten, bis der Startprozess beendet ist, und kannst die Website unter http://localhost:4200 erreichen. Solltest du die auf die Api zugreifen wollen, kannst du dies unter http://localhost:8080 tun.

### Ausführen mit Docker
Damit du die Website und die Api in einem Container auf deinem Rechner ausführen kannst, musst du dir [Docker-Compose][3] herunterladen. Docker ermöglich dem Nutzer für einzelne Programme gesonderte Container zu erstellen, die wie eine Art Virtuelle Maschine funktionieren. Hierbei ist der überzeugende Punkt, dass die Programme getrennt von anderen Prozessen auf deinem Computer laufen. Docker-Compose ist eine Erweiterung die erlaubt, das Starten mehrerer Container zu verknüpfen. Nachdem du Docker installiert hast, öffnest du den Order "weather" in einer Kommandozeile und führst folgenden Befehl aus.
```bash
docker-compose up -d
```
Sobald der Befehl fertig ist, laufen auf deinem Rechner zwei verschiedene Container, jeweils einer für Website und Api. Nun kann du die Website unter http://localhost erreichen. Solltest du die auf die Api zugreifen wollen, kannst du dies unter http://localhost:8080 tun.

[Dokumentation der Api][4]

[1]: https://git-scm.com/downloads
[2]: https://nodejs.org/en/download/
[3]: https://docs.docker.com/compose/install/
[4]: https://github.com/cfRIKO/weather/wiki/Api-Dokumentation
