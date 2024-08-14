"use client";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CrudTable = ({ className, ...props }) => {
  const [shoes, setShoes] = useState([]);
  const [selectedShoes, setSelectedShoes] = useState();
  const header = ["Name", "Brand", "Color", "Size"];
  const inputs = ["name", "brand", "color", "size"];
  const deleteShoe = async (id) => {
    await fetch(`http://localhost:3000/api/shoe`, {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });
    await getShoes();
  };
  const getShoes = async () => {
    const result = await fetch("http://localhost:3000/api/shoe");
    const data = await result.json();
    setShoes(data);
  };

  const upsertShoe = async () => {
    const result = await fetch(`http://localhost:3000/api/shoe`, {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value,
        brand: document.getElementById("brand").value,
        color: document.getElementById("color").value,
        size: document.getElementById("size").value,
      }),
    });
    const data = await result.json();
    console.log(data);
    
    if(result.ok){
      setShoes(data);
    }
  };

  useEffect(() => {
    getShoes();
  }, []);

  useEffect(() => {
    if (selectedShoes) {
      inputs.forEach((input) => {
        document.getElementById(input).value = selectedShoes[input];
      })
    }
  }, [selectedShoes]);


  return (
    <>
      <div className="flex flex-col">
        <div>
          {inputs.map((input) => (
            <>
            <Label htmlFor={input} key={input+input}> {input}</Label>
            <Input
              id={input}
              key={input}
              type="text"
              placeholder={input}
              className="my-2"
            />
            </>
          ))}
          <Button variant="default" onClick={() => upsertShoe()}><Plus/> Add</Button>

        </div>
        <Table className={cn(className, "")} {...props}>
        <TableHeader>
          {header.map((head) => (
            <TableHead key={head}>{head}</TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {shoes.map(({ id, name, brand, color, size }) => (
            <TableRow key={id} className="ring-1 hover:ring-teal-300 cursor-pointer" onClick={() => setSelectedShoes({id, name, brand: brand.name, color: color.name, size})}>
              <TableCell>{name}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{color.name}</TableCell>
              <TableCell>{size}</TableCell>
              <Button variant="destructive" onClick={() => deleteShoe(id)}>
                <Trash /> Delete
              </Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      
    </>
  );
};

const CrudContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center w-full ",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CrudContainer = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("flex flex-1 items-center justify-center ", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const Crud = () => {
  return (
    <CrudContainer>
      <CrudContent>
        <CrudTable />
      </CrudContent>
    </CrudContainer>
  );
};

export default Crud;
