class LoaderUI {
    constructor() {
        this.el = document.getElementById("loader");
        this.textEl = this.el.querySelector(".loader-text");
    }

    hide() { this.el.classList.add("hidden"); }

    show(text=null) {
        this.el.classList.remove("hidden");
        this.textEl.innerText = text ? text : "Loading";
        this.textEl.innerText += "...";
    }
}

class NotificationUI {
    constructor() {
        this.el = document.getElementById("notification");
        this.el.addEventListener("click", () => { this.hide(); });
    }

    hide() { this.el.classList.add("hidden"); }

    show(html, type="success") {
        this.el.classList = type;
        this.el.innerHTML = html;
    }
}

class App {
    constructor() {
        this.loader = new LoaderUI();
        this.notification = new NotificationUI();
        this.state = null;
        this.currentContainerEl = null;
        this.containerEls = {
            form: document.getElementById("form-container"),
            result: document.getElementById("result-container")
        };
        this.resultEl = document.getElementById("result-text");

        this.loader.show("Loading page");
        this._updateState();

        this.containerEls.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this._run(
                document.getElementById("audio-file").files[0],
                document.getElementById("language").value
            );
        });

        document.getElementById("reset-btn").addEventListener("click", () => { this._reset(); });
        document.getElementById("copy-btn").addEventListener("click", () => { this._copy(); });
        document.getElementById("download-btn").addEventListener("click", () => { this._download(); });
    }

    async _apiRequest(url, options = {}) {
        try {
            const response = await fetch(`/api/${url}`, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}${
                    data.detail ? ` - ${data.detail}` : ""
                }`);
            }

            return data;
        } catch (error) {
            this.notification.show(`Error: ${error.message}`, "error");
            return false;
        }
    }


    async _updateState() {
        this.state = await this._apiRequest("state", { method: "GET" });
        this._updateUI();
    }

    _reset() {
        this._apiRequest("reset", { method: "POST" });
        this.state.state = "idle";
        this._updateUI();
    }

    async _run(file, language) {
        this.state.state = "processing"
        this._updateUI();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);
        
        await this._apiRequest("transcribe", { method: "POST", body: formData });
    }

    _updateUI() {
        if (this.state) {
            let newContainerEl = null;
        
            switch (this.state.state) {
                case "idle":
                    this.loader.hide();
                    this.notification.hide();
                    newContainerEl = this.containerEls.form;
                    break;
                case "processing":
                    this.loader.show("Processing file");
                    newContainerEl = this.containerEls.form;
                    setTimeout(() => { this._updateState(); }, 1000);
                    break;
                case "completed":
                    this.loader.hide();
                    this.notification.hide();
                    newContainerEl = this.containerEls.result;
                    this.resultEl.innerHTML = this.state.result;
                    break;
            }

            if (this.currentContainerEl && this.currentContainerEl != newContainerEl) {
                this.currentContainerEl.classList.add("hidden")
            }

            this.currentContainerEl = newContainerEl;
            this.currentContainerEl.classList.remove("hidden");
        }
    }

    _download() {
        const url = URL.createObjectURL(
            new Blob([this.resultEl.innerHTML.replaceAll("<br>", "\n")], {
                type: "text/plain;charset=utf-8"
            })
        );

        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.state.filename}.txt`;
        document.body.appendChild(a);
        a.click();
        this.notification.show("Download started");
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    _copy() {
        navigator.clipboard.writeText(
            this.resultEl.innerHTML.replaceAll("<br>", "\n")
        ).then(() => { this.notification.show("Copied to clipboard"); });
    }
}

new App();