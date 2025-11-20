// Interface for dashboard items
export interface DashboardItem {
    id: number;
    title: string;
    path: string;
  }
  
  interface CompanyType {
    name: string;
    // add other relevant fields
  }
  
  
  // Interface for service items
  export interface ServiceItem {
    id: number;
    title: string;
    path: string;
    services?: ServiceSubItem[]; // Optional sub-services
  }
  
  // Interface for sub-services
  export interface ServiceSubItem {
    id: number;
    title: string;
    path: string;
  }
  
  // Interface for card items
  export interface CardItem {
    id: number;
    title: string;
    path: string;
    content: CardContent; // Reuse the structure for content
  }
  
  // Interface for card content
  export interface CardContent {
    username: string;
    email: string;
    number: string;
    service: string;
    enterYourText: string;
    [key: string]: any; // Allows for additional dynamic properties
  }
  