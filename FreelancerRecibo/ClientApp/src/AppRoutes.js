import { Clientes } from "./components/Clientes";
import {Recibo}  from "./components/Recibo";

const AppRoutes = [
  {
    index: true,
        element: <Recibo />
  },
  
  {
      path: '/Clientes',
      element: <Clientes />
  }
];

export default AppRoutes;
