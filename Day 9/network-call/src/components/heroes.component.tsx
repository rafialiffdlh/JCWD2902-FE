/** @format */

"use client";
import { superheroes } from "@/../json/db.json";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/config/axios.config";
import { HeroForm } from "./form.component";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type THero = (typeof superheroes)[0] | null;

export function DataTableDemo() {
  const [data, setData] = React.useState<typeof superheroes>([]);
  const [search, setSearch] = React.useState<string>("");
  const [editHero, setEditHero] = React.useState<THero>(null);

  const fetchSuperHeroes = async () => {
    const response = await api.get("/superheroes", {
      params: {
        name_like: search,
      },
    });
    setData(response.data);
  };

  const deleteHero = async (id: number) => {
    await api.delete("/superheroes/" + id);
    await fetchSuperHeroes();
  };

  const selectHero = async (hero: (typeof superheroes)[0]) => {
    setEditHero(hero);
  };

  React.useEffect(() => {
    fetchSuperHeroes();
  }, [search]);

  return (
    <div className="w-full max-w-screen-lg px-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          className=" w-full"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead> ID</TableHead>
              <TableHead> NAME</TableHead>
              <TableHead className="w-10"> ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((hero, key) => (
              <TableRow key={key}>
                <TableCell>{hero.id}</TableCell>
                <TableCell>{hero.name}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button onClick={() => selectHero(hero)}>Edit</Button>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant={"destructive"}>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteHero(hero.id)}>
                          Yes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          0 of 0 row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.previousPage()}
            // disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.nextPage()}
            // disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <HeroForm fetch={fetchSuperHeroes} editHero={editHero} />
    </div>
  );
}
