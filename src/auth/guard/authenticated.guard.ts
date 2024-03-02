import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { AuthService } from "../auth.service";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userinDb = await this.authService.checkUser(request.user);
    if (request.isAuthenticated() && userinDb) {
      if ((userinDb.company === undefined && request.route.path == '/profile/complete') || userinDb.company) {
        return request.isAuthenticated();
      } else {
        throw new HttpException('Complete Profile', HttpStatus.NO_CONTENT); // Customize the response code here
      }
    } else {
      return false;
    }
  }
}