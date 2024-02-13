import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"; // Import necessary decorators and classes from the @nestjs/common library.
import { CreateRatingDto, RatingResponseDto, UpdateRatingDto } from "./dto/Rating.dto"; // Import DTOs for creating, updating, and retrieving ratings.
import mongoose from "mongoose"; // Import mongoose for working with MongoDB ObjectId.
import { RatingService } from "./rating.service"; // Import the RatingService from the rating.service file.
import { JwtGuard } from "../guards/jwt.guards"; // Import the JwtGuard from the guards folder.
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"; // Import Swagger decorators for documenting the API.
import { RolesGuard } from "../guards/roles.guards";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";

@ApiTags('ratings') // Add 'ratings' tag to group API under this category in Swagger UI.
@Controller('ratings') // Define the controller's base route.
export class RatingController {
    constructor(private ratingService: RatingService) { } // Inject RatingService into the controller.

    @Post() // Handle HTTP POST requests to create a new rating.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
   @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.    @UsePipes(new ValidationPipe()) // Validate request payload using ValidationPipe.
    @ApiCreatedResponse({ description: 'Rating created successfully.', type: RatingResponseDto }) // Document successful response.
    @ApiBadRequestResponse({ description: 'Invalid data provided.' }) // Document bad request response.
    @ApiBearerAuth() // Specify that JWT token is required for this endpoint.
    createRating(@Body() createRatingDto: CreateRatingDto) { // Define route handler for creating a rating.
        return this.ratingService.createRating(createRatingDto); // Call the RatingService method to create a new rating.
    }

    @Get() // Handle HTTP GET requests to retrieve all ratings.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin,Role.Manager]) // Apply the 'admin' role to this endpoint.
    @ApiOkResponse({ description: 'List of all ratings.', type: [RatingResponseDto] }) // Document successful response.
    async getAllRatings(): Promise<RatingResponseDto[]> { // Define route handler for retrieving all ratings.
        const ratings = await this.ratingService.getAllRatings(); // Call the RatingService method to fetch all ratings.
        if (!ratings) throw new HttpException('No ratings found', 404); // Throw an error if no ratings are found.
        return ratings; // Return the fetched ratings.
    }

    @Get(':id') // Handle HTTP GET requests to retrieve a rating by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
    @Roles([Role.Admin,Role.Manager]) // Apply the 'admin' role to this endpoint.
    @ApiOkResponse({ description: 'Rating found successfully.', type: RatingResponseDto }) // Document successful response.
    @ApiNotFoundResponse({ description: 'Rating not found.' }) // Document not found response.
    async getRatingById(@Param('id') id: string): Promise<RatingResponseDto> { // Define route handler for retrieving a rating by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid ObjectId.
        if (!isValid) throw new HttpException('Invalid rating id', 400); // Throw an error if the ID is invalid.
        const rating = await this.ratingService.getRatingById(id); // Call the RatingService method to fetch the rating by ID.
        if (!rating) throw new HttpException('No rating found', 404); // Throw an error if no rating is found.
        return rating; // Return the fetched rating.
    }

    @Patch(':id') // Handle HTTP PATCH requests to update a rating by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
   @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.    @UsePipes(new ValidationPipe()) // Validate request payload using ValidationPipe.
    @ApiOkResponse({ description: 'Rating updated successfully.', type: RatingResponseDto }) // Document successful response.
    @ApiNotFoundResponse({ description: 'Rating not found.' }) // Document not found response.
    async updateRating(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto): Promise<RatingResponseDto> { // Define route handler for updating a rating by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid ObjectId.
        if (!isValid) throw new HttpException('Invalid rating id', 400); // Throw an error if the ID is invalid.
        const rating = await this.ratingService.updateRating(id, updateRatingDto); // Call the RatingService method to update the rating.
        if (!rating) throw new HttpException('No rating found', 404); // Throw an error if no rating is found.
        return rating; // Return the updated rating.
    }

    @Delete(':id') // Handle HTTP DELETE requests to delete a rating by ID.
    @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard and RolesGuard to protect this endpoint.
   @Roles([Role.Admin]) // Apply the 'admin' role to this endpoint.    @ApiOkResponse({ description: 'Rating deleted successfully.' }) // Document successful response.
    @ApiNotFoundResponse({ description: 'Rating not found.' }) // Document not found response.
    async deleteRating(@Param('id') id: string) { // Define route handler for deleting a rating by ID.
        const isValid = mongoose.Types.ObjectId.isValid(id); // Check if the provided ID is a valid ObjectId.
        if (!isValid) throw new HttpException('Invalid rating id', 400); // Throw an error if the ID is invalid.
        const deletedRating = await this.ratingService.deleteRating(id); // Call the RatingService method to delete the rating.
        if (!deletedRating) throw new HttpException('No rating found', 404); // Throw an error if no rating is found.
        return "Rating deleted successfully"; // Return success message.
    }
}
