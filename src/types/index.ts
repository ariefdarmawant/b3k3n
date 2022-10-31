import React from "react";

export interface Category {
  id: number;
  name: String;
}

export interface BookSection {
  title: string;
  content: string;
}

export interface Book {
  id: number;
  title: string;
  category_id: number;
  authors: string[];
  cover_url: string;
  description: string;
  sections: BookSection[];
  audio_length: number;
}

export interface TabsProps {
  activeTabs: string;
  handleChange: (activeTabs: string) => void;
}

export interface SearchBarProps {
  search: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
