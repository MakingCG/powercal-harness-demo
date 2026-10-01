# F072: iPhone device check

**Epic**: 6. Polish · **Status**: Specified · **Depends on**: all

## Goal

PowerCal is built in a desktop browser but lives on an iPhone, installed on the Home Screen. The risky parts — camera, sharing a file, the keyboard covering buttons, notches, updates — behave differently there and can only be proven on a real device. This is not code; it is the hands-on pass a person runs before the app counts as done. The build agent finishes everything a desktop can show and hands this checklist over.

## Acceptance criteria

1. **Install & first run:** the install hint shows in Safari; the installed app opens without browser bars; onboarding, restore from a backup file and demo data all land on a working day page.
2. **Camera & backup:** scanning asks for the camera only after a tap and reads a supermarket barcode; export opens the share sheet from the tap; a saved file restores on a wiped app.
3. **Keyboard & layout:** in every sheet the keyboard never covers the main button, no field zooms the page, and nothing overflows at 375 × 667 or collides with the notch or home indicator.
4. **Offline, updates & speed:** the app boots fully offline; a new version asks before updating; a recent food logs in 3 taps under 15 seconds; the oldest supported iOS still boots and logs.

## Layout & design

None — F072 is a hands-on device check, not a screen.
