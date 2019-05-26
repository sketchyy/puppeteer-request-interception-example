const puppeteer = require("puppeteer");

const mockResponse = [
  {
    userId: 1,
    id: 1,
    title: "INTERCEPTED 1",
    completed: true
  },
  {
    userId: 1,
    id: 2,
    title: "INTERCEPTED 2",
    completed: false
  }
];

const actualResposnseTest = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });

  await page.screenshot({path: 'actual-backend.png'});

  await browser.close();
}

const requestInterceptorTest = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Allow interception of requests
  await page.setRequestInterception(true);

  // Listen for all "request" events and filter them by url()
  // If url() is /todos, then we return mockResponse
  // Otherwise we continue request to actual server
  page.on("request", request => {
    console.log("INTERCEPTED", request.url());

    if (request.url().endsWith("/todos")) {
      request.respond({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse)
      });
    } else {
      request.continue();
    }
  });

  // Open app page
  await page.goto("http://localhost:4200");

  // Take screenshot to see page is get intercepted data
  await page.screenshot({ path: "mock-backend.png" });

  await browser.close();
};

actualResposnseTest(); // Test vs actual backend. Compate page screenshot with ...
requestInterceptorTest(); // Test with request interception and mock data
