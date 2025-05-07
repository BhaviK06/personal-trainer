// Customer type
export interface Customer {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    streetaddress: string;
    postcode: string;
    city: string;
    _links: {
      self: { href: string };
      customer: { href: string };
      trainings: { href: string };
    };
  }
  
  // Training type
  export interface Training {
    date: string; // ISO string
    duration: number;
    activity: string;
    customer: string; // URL of customer
  }
  