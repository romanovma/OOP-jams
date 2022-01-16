interface SupportRequest {
  question: string;
}

class Employee {
  constructor(private name: string) {}
}

// Chain of Responsibility
interface SupportHandler {
  setNext(h: SupportHandler): void;
  handleRequest(request: SupportRequest): void;
}

abstract class SupportHandlerBase implements SupportHandler {
  private next: SupportHandler;
  private queue: SupportQueue;

  constructor(private availableEmployees: Employee[]) {}

  setNext(h: SupportHandler): void {
    this.next = h;
  }

  handleRequest(request: SupportRequest): void {
    const employee = this.lockEmployee();

    if (!employee) {
      this.queue.enqueue(request);

      return;
    }

    this.handle(request);

    this.unlockEmployee(employee);
    const requestFromQueue = this.queue.dequeue();
    if (requestFromQueue) {
      this.handle(requestFromQueue);
    }
  }

  protected handle(request: SupportRequest) {
    if (this.next) {
      this.next.handleRequest(request);
    }
  }

  private lockEmployee(): Employee | undefined {
    return this.availableEmployees.pop();
  }

  private unlockEmployee(employee): void {
    this.availableEmployees.unshift(employee);
  }
}

class Respondents extends SupportHandlerBase {
  protected handle(request: SupportRequest) {
    try {
      // do some stuff
      console.log(`Respondent: ${request.question}`);
    } catch (err) {
      console.log(err);
      super.handle(request);
    }
  }
}

class Managers extends SupportHandlerBase {
  protected handle(request: SupportRequest) {
    try {
      // do some stuff
      console.log(`Manager: ${request.question}`);
    } catch (err) {
      console.log(err);
      super.handle(request);
    }
  }
}

class Directors extends SupportHandlerBase {
  protected handle(request: SupportRequest) {
    try {
      // do some stuff
      console.log(`Director: ${request.question}`);
    } catch (err) {
      console.log(err);
      super.handle(request);
    }
  }
}

const respondents = new Respondents([new Employee("E")]);
const managers = new Managers([new Employee("M")]);
const directors = new Directors([new Employee("D")]);

respondents.setNext(managers);
managers.setNext(directors);

respondents.handleRequest({
  question: "cannot logout",
});

class SupportQueue {
  requests: SupportRequest[];

  enqueue(request: SupportRequest): void {
    this.requests.unshift(request);
  }

  dequeue(): SupportRequest | undefined {
    return this.requests.pop();
  }
}
