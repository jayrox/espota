# espota
ESP OTA Server
----

place ESP8266 bin files in the `public/bin` folder in the format `project-version.bin`

then update your sketch to include `#include <ESP8266httpUpdate.h>`

then in your `setup` add
```
long timeCounter; // milliseconds counter
long timePassed; // The actual milliseconds time

void setup() {
  timeCounter = millis(); // read the actual internal time
  timePassed = 0; // we start with no time passed
  ...
}

```

then within your `loop` add something like
```
void loop() {
  timePassed = millis() - timeCounter;
  if(timePassed >= 10000) {
    Serial.println("Checking firmware for update.");
    timeCounter = millis();
    t_httpUpdate_return ret = ESPhttpUpdate.update("http://espotaserver:36942/example-1.bin");

    switch(ret) {
      case HTTP_UPDATE_FAILED:
        Serial.printf("HTTP_UPDATE_FAILD Error (%d): %s", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
        break;

      case HTTP_UPDATE_NO_UPDATES:
        Serial.println("HTTP_UPDATE_NO_UPDATES");
        break;

      case HTTP_UPDATE_OK:
        Serial.println("HTTP_UPDATE_OK");
        break;
    }
    return;
  }
}
```

then when you update your sketch and want it to auto update OTA, update the url to a new version 
from `http://espotaserver:36942/example-1.bin` to `http://espotaserver:36942/example-2.bin`
compile the code and place the updated bin into the `public/bin` folder and rename the file to match the updated version
`example-2.bin`
