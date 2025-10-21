# luma

Luma is a minimal implementation of a Client Side Directory Image Viewer. Simply Upload a directory and browse. It is aimed to be simple, clean and just work out of the box.
<img alt="luma" src="https://github.com/user-attachments/assets/fba5aa8e-89af-4e4b-8b34-a84952334cc7" />

<img alt="Gallary View" src="https://github.com/user-attachments/assets/58fbd851-b1a3-49ca-851b-15e981931697" />
(Yes these are my wallpapers)

<img width="1828" height="984" alt="image" src="https://github.com/user-attachments/assets/bafbcb67-d772-4210-a7e0-a8da5245f78c" />

<img width="1828" height="984" alt="image" src="https://github.com/user-attachments/assets/fbd107c6-9d43-450f-a793-8683a3928f93" />

---

## Features

1. Fully Private - No server ever
2. Fast
3. Intuitive UI/UX
4. Available in LIGHT theme (Tried my best to not make it an eyesore)
5. Easy navigation using Directory Explorer

---

## Installation

```bash
git clone https://github.com/KreativeThinker/luma

cd luma

pnpm install
```

---

## Usage

```bash
pnpm start
```

---

## Challenges and Issues

1. Bulk uploads of folder sizes > 2GB can cause lag in the system.
2. Attempts at lazy-loading images with an intersection observer ran into issues with the files not loading in the correct order
3. Only allows for Directory/Folder uploads
4. Insufficient customization and control
5. I attempted to add face recognition and clustering but was unable to do so without increasing the computational cost in the system

---

## License

This project is licensed under the [MIT License](LICENSE).
