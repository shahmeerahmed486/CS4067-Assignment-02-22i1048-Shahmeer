FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["/Frontend.Mvc.csproj", "Frontend.Mvc/"]
RUN dotnet restore "Frontend.Mvc/Frontend.Mvc.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "Frontend.Mvc.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "Frontend.Mvc.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Frontend.Mvc.dll"]