import { Request, Response } from 'express';
import { Character } from '../models/character';
import { convertToSimplified } from '../utils/convert';

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const { name, dynasty } = req.query;
    console.log('Received search query:', { name, dynasty });

    const query: any = {};

    if (name) {
      console.log('Original name:', name);
      const convertedName = convertToSimplified(name as string);
      console.log('Converted name:', convertedName);
      query.name = { $regex: convertedName, $options: 'i' };
    }

    if (dynasty) {
      query.dynasty = dynasty;
    }

    console.log('Database query:', query);
    const characters = await Character.find(query);
    console.log('Database query results:', characters);
    
    const convertedCharacters = characters.map(char => ({
      ...char.toObject(),
      name: convertToSimplified(char.name),
      dynasty: convertToSimplified(char.dynasty),
      description: convertToSimplified(char.description)
    }));
    console.log('Converted characters:', convertedCharacters);

    res.json(convertedCharacters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ message: 'Error fetching characters' });
  }
};

export const getCharacterById = async (req: Request, res: Response) => {
  try {
    const character = await Character.findById(req.params.id);
    console.log('Character by ID:', character);
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const convertedCharacter = {
      ...character.toObject(),
      name: convertToSimplified(character.name),
      dynasty: convertToSimplified(character.dynasty),
      description: convertToSimplified(character.description)
    };
    console.log('Converted character:', convertedCharacter);

    res.json(convertedCharacter);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ message: 'Error fetching character' });
  }
};

export const getDynasties = async (req: Request, res: Response) => {
  try {
    const dynasties = await Character.distinct('dynasty');
    console.log('All dynasties:', dynasties);
    
    const convertedDynasties = dynasties.map(dynasty => convertToSimplified(dynasty));
    console.log('Converted dynasties:', convertedDynasties);

    res.json(convertedDynasties);
  } catch (error) {
    console.error('Error fetching dynasties:', error);
    res.status(500).json({ message: 'Error fetching dynasties' });
  }
}; 