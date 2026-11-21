
ESP32 Charging Station Firmware

This directory stores the ESP32 firmware source code.

Planned files:
- ESP32_Charging_Station.ino
- config.h
- secrets.example.h
- mqtt_handler.h
- station_controller.h
- energy_calculator.h
- tariff_manager.h
- fault_manager.h
- storage_manager.h
- oled_display.h
- ota_manager.h

Important:
- One firmware supports ST001 and ST002.
- Station identity is configured separately.
- Never commit Wi-Fi or MQTT credentials.
- Firmware must remain compatible with the Node-RED MQTT Flow.
